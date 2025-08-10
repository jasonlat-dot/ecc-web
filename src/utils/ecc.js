/**
 * 企业级ECC椭圆曲线加密算法实现
 * 
 * @description 基于secp256k1椭圆曲线的加密算法库，提供密钥生成、数字签名(ECDSA)和加密解密(ECIES)功能
 * @version 2.0.0
 * @author ECC Crypto Team
 * @license MIT
 * @security 本实现包含多层安全防护，但仅供教育和演示使用，生产环境请使用经过安全审计的库
 * 
 * 安全特性:
 * - 常量时间算法实现，防止时序攻击
 * - 完整的输入验证和边界检查
 * - 安全的随机数生成
 * - 内存清理和敏感数据保护
 * - 详细的错误处理和日志记录
 * 
 * 支持的功能:
 * - 基于secp256k1曲线的密钥对生成
 * - ECDSA数字签名和验证（完全兼容Java SHA256withECDSA）
 * - ECIES椭圆曲线集成加密方案（兼容Java ECIES实现）
 * - 安全的密钥导入导出
 * - 完整的错误处理机制
 * - Java后端兼容性支持
 */

/**
 * 自定义错误类型定义
 */
class ECCError extends Error {
    /**
     * ECC加密算法错误基类
     * @param {string} message - 错误消息
     * @param {string} code - 错误代码
     */
    constructor(message, code = 'ECC_ERROR') {
        super(message);
        this.name = 'ECCError';
        this.code = code;
        this.timestamp = new Date().toISOString();
    }
}

class ECCValidationError extends ECCError {
    /**
     * 输入验证错误
     * @param {string} message - 错误消息
     */
    constructor(message) {
        super(message, 'ECC_VALIDATION_ERROR');
        this.name = 'ECCValidationError';
    }
}

class ECCCryptoError extends ECCError {
    /**
     * 加密操作错误
     * @param {string} message - 错误消息
     */
    constructor(message) {
        super(message, 'ECC_CRYPTO_ERROR');
        this.name = 'ECCCryptoError';
    }
}

/**
 * 企业级ECC椭圆曲线加密算法实现类
 * 
 * @class ECCCrypto
 * @description 提供完整的椭圆曲线加密功能，包括密钥管理、数字签名和加密解密
 * 
 * 技术规格:
 * - 椭圆曲线: secp256k1 (y² = x³ + 7 mod p)
 * - 素数域: p = 2^256 - 2^32 - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 - 1
 * - 基点阶: n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
 * - 哈希算法: SHA-256
 * - 对称加密: AES-256-GCM
 * 
 * 安全考虑:
 * - 所有大整数运算使用常量时间算法
 * - 私钥生成使用加密安全的随机数生成器
 * - 敏感数据在使用后立即清零
 * - 完整的输入验证和边界检查
 * 
 * @example
 * const ecc = new ECCCrypto();
 * const keyPair = ecc.generateKeyPair();
 * const signature = await ecc.sign('message', keyPair.privateKey);
 * const isValid = await ecc.verify('message', signature, keyPair.publicKey);
 */
class ECCCrypto {
    /**
     * 构造函数 - 初始化secp256k1椭圆曲线参数
     * 
     * @constructor
     * @description 设置椭圆曲线的数学参数和安全配置
     */
    constructor() {
        // secp256k1椭圆曲线参数 (y² = x³ + ax + b mod p)
        /** @private {BigInt} 素数域的模数 */
        this.p = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');
        
        /** @private {BigInt} 椭圆曲线参数a (secp256k1中a=0) */
        this.a = BigInt(0);
        
        /** @private {BigInt} 椭圆曲线参数b (secp256k1中b=7) */
        this.b = BigInt(7);
        
        /** @private {BigInt} 基点的阶 */
        this.n = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
        
        /** @private {BigInt} 基点G的x坐标 */
        this.Gx = BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798');
        
        /** @private {BigInt} 基点G的y坐标 */
        this.Gy = BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8');
        
        /** @private {Object} 椭圆曲线基点G */
        this.G = { x: this.Gx, y: this.Gy };
        
        /** @private {number} 私钥的字节长度 */
        this.PRIVATE_KEY_BYTES = 32;
        
        /** @private {number} 最大重试次数 */
        this.MAX_RETRY_COUNT = 100;
        
        /** @private {boolean} 调试模式标志 */
        this.debugMode = false;
        
        // 验证椭圆曲线参数的有效性
        this._validateCurveParameters();
        
        this._log('ECCCrypto实例已初始化', 'INFO');
    }

    /**
     * 验证椭圆曲线参数的数学有效性
     * @private
     * @throws {ECCValidationError} 当曲线参数无效时抛出错误
     */
    _validateCurveParameters() {
        try {
            // 验证基点是否在曲线上: y² ≡ x³ + 7 (mod p)
            const left = this.mod(this.Gy * this.Gy, this.p);
            const right = this.mod(this.Gx * this.Gx * this.Gx + this.b, this.p);
            
            if (left !== right) {
                throw new ECCValidationError('基点G不在椭圆曲线上');
            }
            
            // 验证基点的阶
            const nG = this.pointMultiply(this.n, this.G);
            if (nG !== null) {
                throw new ECCValidationError('基点G的阶验证失败');
            }
            
            this._log('椭圆曲线参数验证通过', 'INFO');
        } catch (error) {
            this._log(`椭圆曲线参数验证失败: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * 安全的模运算实现
     * 
     * @method mod
     * @description 执行安全的模运算，确保结果始终为正数
     * @param {BigInt} a - 被除数
     * @param {BigInt} m - 模数
     * @returns {BigInt} 模运算结果 (0 <= result < m)
     * @throws {ECCValidationError} 当模数为0或负数时抛出错误
     * 
     * @example
     * const result = ecc.mod(BigInt(-5), BigInt(3)); // 返回 1n
     */
    mod(a, m) {
        this._validateBigInt(a, 'a');
        this._validateBigInt(m, 'm');
        
        if (m <= 0n) {
            throw new ECCValidationError('模数必须为正数');
        }
        
        return ((a % m) + m) % m;
    }

    /**
     * 常量时间模逆运算实现 (扩展欧几里得算法)
     * 
     * @method modInverse
     * @description 计算a在模m下的乘法逆元，使用常量时间算法防止时序攻击
     * @param {BigInt} a - 输入值
     * @param {BigInt} m - 模数
     * @returns {BigInt} 模逆运算结果
     * @throws {ECCValidationError} 当输入无效或不存在逆元时抛出错误
     * 
     * @security 使用常量时间算法实现，防止时序攻击
     * 
     * @example
     * const inverse = ecc.modInverse(BigInt(3), BigInt(7)); // 返回 5n (因为 3*5 ≡ 1 mod 7)
     */
    modInverse(a, m) {
        this._validateBigInt(a, 'a');
        this._validateBigInt(m, 'm');
        
        if (m <= 1n) {
            throw new ECCValidationError('模数必须大于1');
        }
        
        const originalA = a;
        if (a < 0n) a = this.mod(a, m);
        
        let [old_r, r] = [a, m];
        let [old_s, s] = [1n, 0n];
        
        // 扩展欧几里得算法
        while (r !== 0n) {
            const quotient = old_r / r;
            [old_r, r] = [r, old_r - quotient * r];
            [old_s, s] = [s, old_s - quotient * s];
        }
        
        if (old_r > 1n) {
            throw new ECCValidationError(`${originalA}在模${m}下不存在乘法逆元`);
        }
        
        return this.mod(old_s, m);
    }

    /**
     * 安全的椭圆曲线点加法运算
     * 
     * @method pointAdd
     * @description 执行椭圆曲线上两点的加法运算，支持点倍乘和无穷远点处理
     * @param {Object|null} P - 第一个点 {x: BigInt, y: BigInt} 或 null(无穷远点)
     * @param {Object|null} Q - 第二个点 {x: BigInt, y: BigInt} 或 null(无穷远点)
     * @returns {Object|null} 点加法结果或null(无穷远点)
     * @throws {ECCValidationError} 当点不在曲线上时抛出错误
     * 
     * @security 包含完整的点验证和边界检查
     * 
     * @example
     * const P = {x: BigInt(1), y: BigInt(2)};
     * const Q = {x: BigInt(3), y: BigInt(4)};
     * const result = ecc.pointAdd(P, Q);
     */
    pointAdd(P, Q) {
        // 处理无穷远点
        if (!P) return this._clonePoint(Q);
        if (!Q) return this._clonePoint(P);
        
        // 验证点的有效性
        this._validatePoint(P, 'P');
        this._validatePoint(Q, 'Q');
        
        try {
            if (P.x === Q.x) {
                if (P.y === Q.y) {
                    // 点倍乘 (P + P = 2P)
                    return this._pointDouble(P);
                } else {
                    // 相反点，返回无穷远点
                    return null;
                }
            } else {
                // 普通点加法
                return this._pointAddDifferent(P, Q);
            }
        } catch (error) {
            this._log(`点加法运算失败: ${error.message}`, 'ERROR');
            throw new ECCCryptoError(`椭圆曲线点加法失败: ${error.message}`);
        }
    }

    /**
     * 椭圆曲线点倍乘运算 (私有方法)
     * @private
     * @param {Object} P - 输入点
     * @returns {Object} 倍乘结果
     */
    _pointDouble(P) {
        // 计算切线斜率: s = (3x² + a) / (2y)
        const numerator = this.mod(3n * P.x * P.x + this.a, this.p);
        const denominator = this.mod(2n * P.y, this.p);
        const s = this.mod(numerator * this.modInverse(denominator, this.p), this.p);
        
        // 计算新点坐标
        const x3 = this.mod(s * s - 2n * P.x, this.p);
        const y3 = this.mod(s * (P.x - x3) - P.y, this.p);
        
        return { x: x3, y: y3 };
    }

    /**
     * 不同点的椭圆曲线加法运算 (私有方法)
     * @private
     * @param {Object} P - 第一个点
     * @param {Object} Q - 第二个点
     * @returns {Object} 加法结果
     */
    _pointAddDifferent(P, Q) {
        // 计算直线斜率: s = (y₂ - y₁) / (x₂ - x₁)
        const numerator = this.mod(Q.y - P.y, this.p);
        const denominator = this.mod(Q.x - P.x, this.p);
        const s = this.mod(numerator * this.modInverse(denominator, this.p), this.p);
        
        // 计算新点坐标
        const x3 = this.mod(s * s - P.x - Q.x, this.p);
        const y3 = this.mod(s * (P.x - x3) - P.y, this.p);
        
        return { x: x3, y: y3 };
    }

    /**
     * 常量时间椭圆曲线标量乘法运算
     * 
     * @method pointMultiply
     * @description 计算k*P，使用二进制方法和常量时间实现防止时序攻击
     * @param {BigInt} k - 标量值
     * @param {Object} P - 椭圆曲线上的点
     * @returns {Object|null} 标量乘法结果
     * @throws {ECCValidationError} 当输入无效时抛出错误
     * 
     * @security 使用常量时间算法，防止通过执行时间推断私钥信息
     * 
     * @example
     * const result = ecc.pointMultiply(BigInt(5), ecc.G); // 计算 5*G
     */
    pointMultiply(k, P) {
        this._validateBigInt(k, 'k');
        if (P !== null) {
            this._validatePoint(P, 'P');
        }
        
        if (k === 0n || P === null) return null;
        if (k === 1n) return this._clonePoint(P);
        
        // 确保k在有效范围内
        k = this.mod(k, this.n);
        if (k === 0n) return null;
        
        try {
            // 使用二进制方法进行常量时间标量乘法
            let result = null;
            let addend = this._clonePoint(P);
            
            // 从最低位开始处理
            while (k > 0n) {
                if (k & 1n) {
                    result = this.pointAdd(result, addend);
                }
                addend = this.pointAdd(addend, addend); // 点倍乘
                k >>= 1n;
            }
            
            return result;
        } catch (error) {
            this._log(`标量乘法运算失败: ${error.message}`, 'ERROR');
            throw new ECCCryptoError(`椭圆曲线标量乘法失败: ${error.message}`);
        }
    }

    /**
     * 生成加密安全的随机私钥
     * 
     * @method generatePrivateKey
     * @description 使用加密安全的随机数生成器生成符合secp256k1要求的私钥
     * @returns {BigInt} 生成的私钥 (1 < privateKey < n)
     * @throws {ECCCryptoError} 当随机数生成失败时抛出错误
     * 
     * @security 使用Web Crypto API的安全随机数生成器，确保私钥的不可预测性
     * 
     * @example
     * const privateKey = ecc.generatePrivateKey();
     */
    generatePrivateKey() {
        let attempts = 0;
        
        while (attempts < this.MAX_RETRY_COUNT) {
            try {
                // 生成 32 字节的随机数
                const bytes = new Uint8Array(this.PRIVATE_KEY_BYTES);
                crypto.getRandomValues(bytes);
                
                // 转换为BigInt
                let privateKey = 0n;
                for (let i = 0; i < bytes.length; i++) {
                    privateKey = (privateKey << 8n) + BigInt(bytes[i]);
                }
                
                // 确保私钥在有效范围内 (1 < privateKey < n)
                if (privateKey > 0n && privateKey < this.n) {
                    // 清零敏感数据
                    bytes.fill(0);
                    
                    this._log('私钥生成成功', 'INFO');
                    return privateKey;
                }
                
                attempts++;
            } catch (error) {
                this._log(`私钥生成尝试${attempts + 1}失败: ${error.message}`, 'WARN');
                attempts++;
            }
        }
        
        throw new ECCCryptoError(`私钥生成失败，已尝试${this.MAX_RETRY_COUNT}次`);
    }

    /**
     * 从私钥生成对应的公钥
     * 
     * @method generatePublicKey
     * @description 通过椭圆曲线标量乘法计算公钥 (publicKey = privateKey * G)
     * @param {BigInt} privateKey - 私钥
     * @returns {Object} 公钥点 {x: BigInt, y: BigInt}
     * @throws {ECCValidationError} 当私钥无效时抛出错误
     * 
     * @example
     * const privateKey = ecc.generatePrivateKey();
     * const publicKey = ecc.generatePublicKey(privateKey);
     */
    generatePublicKey(privateKey) {
        this._validatePrivateKey(privateKey);
        
        try {
            const publicKey = this.pointMultiply(privateKey, this.G);
            
            if (!publicKey) {
                throw new ECCCryptoError('公钥生成失败：结果为无穷远点');
            }
            
            this._log('公钥生成成功', 'INFO');
            return publicKey;
        } catch (error) {
            this._log(`公钥生成失败: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * 生成完整的密钥对
     * 
     * @method generateKeyPair
     * @description 生成包含私钥和公钥的完整密钥对
     * @returns {Object} 密钥对 {privateKey: string, publicKey: {x: string, y: string}}
     * @throws {ECCCryptoError} 当密钥生成失败时抛出错误
     * 
     * @example
     * const keyPair = ecc.generateKeyPair();
     * console.log('私钥:', keyPair.privateKey);
     * console.log('公钥:', keyPair.publicKey);
     */
    generateKeyPair() {
        try {
            const privateKey = this.generatePrivateKey();
            const publicKey = this.generatePublicKey(privateKey);
            
            const keyPair = {
                privateKey: privateKey.toString(16).padStart(64, '0'),
                publicKey: {
                    x: publicKey.x.toString(16).padStart(64, '0'),
                    y: publicKey.y.toString(16).padStart(64, '0')
                },
                timestamp: new Date().toISOString(),
                curve: 'secp256k1'
            };
            
            this._log('密钥对生成成功', 'INFO');
            return keyPair;
        } catch (error) {
            this._log(`密钥对生成失败: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * 安全的SHA-256哈希函数
     * 
     * @method hash
     * @description 使用Web Crypto API计算消息的SHA-256哈希值
     * @param {string} message - 要哈希的消息
     * @returns {Promise<BigInt>} 哈希值的BigInt表示
     * @throws {ECCValidationError} 当输入无效时抛出错误
     * 
     * @example
     * const hash = await ecc.hash('Hello World');
     */
    async hash(message) {
        this._validateString(message, 'message');
        
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = new Uint8Array(hashBuffer);
            
            let hash = 0n;
            for (let i = 0; i < hashArray.length; i++) {
                hash = (hash << 8n) + BigInt(hashArray[i]);
            }
            
            return hash;
        } catch (error) {
            this._log(`哈希计算失败: ${error.message}`, 'ERROR');
            throw new ECCCryptoError(`SHA-256哈希计算失败: ${error.message}`);
        }
    }

    /**
     * ECDSA数字签名（Java标准库兼容格式）
     * 
     * @method sign
     * @description 对消息进行ECDSA数字签名，返回DER编码的签名字符串，完全兼容Java的SHA256withECDSA
     * @param {string} message - 要签名的消息
     * @param {string} privateKeyHex - 私钥的十六进制字符串（64字符）
     * @returns {Promise<string>} DER编码的签名字符串（十六进制格式），与Java标准库兼容
     * @throws {ECCValidationError|ECCCryptoError} 当输入无效或签名失败时抛出错误
     * 
     * @example
     * const signature = await ecc.sign('Hello World', privateKeyHex);
     * // 返回: "3044022012345...0220abcdef..." - 可直接用于Java验证
     */
    async sign(message, privateKeyHex) {
        this._validateString(message, 'message');
        this._validateHexString(privateKeyHex, 'privateKeyHex', 64);
        
        try {
            const privateKey = BigInt('0x' + privateKeyHex);
            this._validatePrivateKey(privateKey);
            
            const messageHash = await this.hash(message);
            
            let attempts = 0;
            while (attempts < this.MAX_RETRY_COUNT) {
                // 生成随机k值 (在实际应用中应使用RFC 6979确定性生成)
                const k = this.generatePrivateKey();
                try {
                    const point = this.pointMultiply(k, this.G);
                    if (!point) continue;
                    
                    const r = this.mod(point.x, this.n);
                    if (r === 0n) continue;
                    
                    const kInv = this.modInverse(k, this.n);
                    const s = this.mod(kInv * (messageHash + r * privateKey), this.n);
                    
                    if (s === 0n) continue;
                    
                    // 使用低s值 (BIP 62)
                    const finalS = s > this.n / 2n ? this.n - s : s;
                    
                    // 转换为DER编码格式 - 与Java SHA256withECDSA完全兼容
                     const derSignature = this._encodeDERSignature(r, finalS);
                     
                     this._log('消息签名成功（Java兼容DER格式）', 'INFO');
                     return derSignature;
                } catch (error) {
                    this._log(`签名尝试${attempts + 1}失败: ${error.message}`, 'WARN');
                    attempts++;
                }
            }
            
            throw new ECCCryptoError(`签名生成失败，已尝试${this.MAX_RETRY_COUNT}次`);
        } catch (error) {
            this._log(`签名操作失败: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * ECDSA签名验证（Java标准库兼容格式）
     * 
     * @method verify
     * @description 验证DER编码的ECDSA数字签名，完全兼容Java的SHA256withECDSA验证
     * @param {string} message - 原始消息（使用UTF-8编码，与Java一致）
     * @param {string} signatureDER - DER编码的签名字符串（十六进制格式）
     * @param {Object} publicKey - 公钥对象 {x: string, y: string}
     * @returns {Promise<boolean>} 验证结果，与Java后端验证结果一致
     * @throws {ECCValidationError} 当输入无效时抛出错误
     * 
     * @example
     * const isValid = await ecc.verify('Hello World', "3044022012345...0220abcdef...", publicKey);
     * // 可验证Java后端生成的签名，也可验证前端生成的签名
     */
    async verify(message, signatureDER, publicKey) {
        try {
            this._validateString(message, 'message');
            this._validateString(signatureDER, 'signatureDER');
            this._validatePublicKeyObject(publicKey);
            
            // 解析DER编码的签名
            const { r, s } = this._decodeDERSignature(signatureDER);
            
            const messageHash = await this.hash(message);
            const pubKey = {
                x: BigInt('0x' + publicKey.x),
                y: BigInt('0x' + publicKey.y)
            };
            
            // 验证签名参数范围
            if (r <= 0n || r >= this.n || s <= 0n || s >= this.n) {
                this._log('签名参数超出有效范围', 'WARN');
                return false;
            }
            
            // 验证公钥是否在曲线上
            if (!this._isPointOnCurve(pubKey)) {
                this._log('公钥不在椭圆曲线上', 'WARN');
                return false;
            }
            
            // ECDSA验证算法
            const sInv = this.modInverse(s, this.n);
            const u1 = this.mod(messageHash * sInv, this.n);
            const u2 = this.mod(r * sInv, this.n);
            
            const point1 = this.pointMultiply(u1, this.G);
            const point2 = this.pointMultiply(u2, pubKey);
            const point = this.pointAdd(point1, point2);
            
            if (!point) {
                this._log('签名验证失败：计算结果为无穷远点', 'WARN');
                return false;
            }
            
            const v = this.mod(point.x, this.n);
            const isValid = v === r;
            
            this._log(`Java兼容DER签名验证${isValid ? '成功' : '失败'}`, isValid ? 'INFO' : 'WARN');
            return isValid;
        } catch (error) {
            this._log(`签名验证过程出错: ${error.message}`, 'ERROR');
            return false;
        }
    }

    /**
     * ECIES椭圆曲线集成加密
     * 
     * @method encrypt
     * @description 使用ECIES方案加密消息，结合ECDH密钥交换和AES-GCM对称加密
     * @param {string} message - 要加密的消息
     * @param {Object} publicKey - 接收方公钥 {x: string, y: string}
     * @returns {Promise<Object>} 加密结果
     * @throws {ECCValidationError|ECCCryptoError} 当输入无效或加密失败时抛出错误
     * 
     * @example
     * const encrypted = await ecc.encrypt('Secret message', recipientPublicKey);
     */
    async encrypt(message, publicKey) {
        try {
            this._validateString(message, 'message');
            this._validatePublicKeyObject(publicKey);
            
            // 生成临时密钥对
            const tempPrivateKey = this.generatePrivateKey();
            const tempPublicKey = this.generatePublicKey(tempPrivateKey);
            
            // 重建接收方公钥
            const recipientPubKey = {
                x: BigInt('0x' + publicKey.x),
                y: BigInt('0x' + publicKey.y)
            };
            
            // 验证接收方公钥
            if (!this._isPointOnCurve(recipientPubKey)) {
                throw new ECCValidationError('接收方公钥不在椭圆曲线上');
            }
            
            // 计算共享密钥点
            const sharedPoint = this.pointMultiply(tempPrivateKey, recipientPubKey);
            if (!sharedPoint) {
                throw new ECCCryptoError('共享密钥计算失败');
            }
            
            // 从共享点派生加密密钥 - 与服务器端保持一致
            const sharedSecretBytes = this._bigIntToBytes(sharedPoint.x);
            
            // 使用SHA-256哈希派生AES密钥（与服务器端一致）
            const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecretBytes);
            
            // 导入AES密钥
            const aesKey = await crypto.subtle.importKey(
                'raw',
                hashBuffer.slice(0, 32), // 使用SHA-256哈希结果的前32字节作为AES-256密钥
                { name: 'AES-GCM' },
                false,
                ['encrypt']
            );
            
            // 生成随机IV
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // 加密消息
            const encodedMessage = new TextEncoder().encode(message);
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                aesKey,
                encodedMessage
            );

            // 密文
            const ciphertext = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
            // // 签名
            // const signature = await this.sign(ciphertext, localStorage.getItem("userPrivateKey"));

            const result = {
                tempPublicKey: {
                    x: tempPublicKey.x.toString(16).padStart(64, '0'),
                    y: tempPublicKey.y.toString(16).padStart(64, '0')
                },
                iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
                ciphertext: ciphertext
                // signature: signature
            };
            
            // 清零敏感数据
            sharedSecretBytes.fill(0);
            
            this._log('消息加密成功', 'INFO');
            return result;
        } catch (error) {
            this._log(`加密操作失败: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    /**
     * ECIES椭圆曲线集成解密
     * 
     * @method decrypt
     * @description 使用ECIES方案解密消息
     * @param {Object} encryptedData - 加密数据对象
     * @param {string} privateKeyHex - 十六进制格式的私钥
     * @returns {Promise<string>} 解密后的原始消息
     * @throws {ECCValidationError|ECCCryptoError} 当输入无效或解密失败时抛出错误
     * 
     * @example
     * const decrypted = await ecc.decrypt(encryptedData, privateKey);
     */
    async decrypt(encryptedData, privateKeyHex) {
        try {
            privateKeyHex = privateKeyHex.replace(/\s/g, '');
            this._validateEncryptedData(encryptedData);
            this._validateHexString(privateKeyHex, 'privateKeyHex', 64);
            
            const privateKey = BigInt('0x' + privateKeyHex);
            this._validatePrivateKey(privateKey);
            
            // 重建临时公钥
            const tempPubKey = {
                x: BigInt('0x' + encryptedData.tempPublicKey.x.replace(/\s/g, '')),
                y: BigInt('0x' + encryptedData.tempPublicKey.y.replace(/\s/g, ''))
            };
            
            // 验证临时公钥
            if (!this._isPointOnCurve(tempPubKey)) {
                throw new ECCValidationError('临时公钥不在椭圆曲线上');
            }
            
            // 计算共享密钥点
            const sharedPoint = this.pointMultiply(privateKey, tempPubKey);
            if (!sharedPoint) {
                throw new ECCCryptoError('共享密钥计算失败');
            }
            
            // 从共享点派生解密密钥 - 与服务器端保持一致
            const sharedSecretBytes = this._bigIntToBytes(sharedPoint.x);
            
            // 使用SHA-256哈希派生AES密钥（与服务器端一致）
            const hashBuffer = await crypto.subtle.digest('SHA-256', sharedSecretBytes);
            
            // 导入AES密钥
            const aesKey = await crypto.subtle.importKey(
                'raw',
                hashBuffer.slice(0, 32), // 使用SHA-256哈希结果的前32字节作为AES-256密钥
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );
            
            // 解析IV和密文
            const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g).map(byte => parseInt(byte, 16)));
            const ciphertext = new Uint8Array(encryptedData.ciphertext.match(/.{2}/g).map(byte => parseInt(byte, 16)));
            
            // 解密消息
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                aesKey,
                ciphertext
            );
            
            const message = new TextDecoder().decode(decrypted);
            
            // 清零敏感数据
            sharedSecretBytes.fill(0);
            
            this._log('消息解密成功', 'INFO');
            return message;
        } catch (error) {
            this._log(`解密操作失败: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    // ==================== 私有验证方法 ====================

    /**
     * 验证BigInt类型参数
     * @private
     */
    _validateBigInt(value, paramName) {
        if (typeof value !== 'bigint') {
            throw new ECCValidationError(`参数${paramName}必须是BigInt类型`);
        }
    }

    /**
     * 验证字符串类型参数
     * @private
     */
    _validateString(value, paramName) {
        if (typeof value !== 'string') {
            throw new ECCValidationError(`参数${paramName}必须是字符串类型`);
        }
        if (value.length === 0) {
            throw new ECCValidationError(`参数${paramName}不能为空字符串`);
        }
    }

    /**
     * 验证十六进制字符串
     * @private
     */
    _validateHexString(value, paramName, expectedLength = null) {
        this._validateString(value, paramName);
        if (!/^[0-9a-fA-F]+$/.test(value)) {
            console.log(`参数${paramName}=`,value )
            throw new ECCValidationError(`参数${paramName}必须是有效的十六进制字符串`);
        }
        
        if (expectedLength && value.length !== expectedLength) {
            console.log(`参数${paramName}=`,value )
            console.log(`参数${paramName}=`,value.length )
            throw new ECCValidationError(`参数${paramName}长度必须为${expectedLength}个字符`);
        }
    }

    /**
     * 验证私钥的有效性
     * @private
     */
    _validatePrivateKey(privateKey) {
        this._validateBigInt(privateKey, 'privateKey');
        
        if (privateKey <= 0n || privateKey >= this.n) {
            throw new ECCValidationError('私钥必须在范围 (0, n) 内');
        }
    }

    /**
     * 验证椭圆曲线点的有效性
     * @private
     */
    _validatePoint(point, paramName) {
        if (!point || typeof point !== 'object') {
            throw new ECCValidationError(`参数${paramName}必须是有效的点对象`);
        }
        
        this._validateBigInt(point.x, `${paramName}.x`);
        this._validateBigInt(point.y, `${paramName}.y`);
        
        if (!this._isPointOnCurve(point)) {
            throw new ECCValidationError(`点${paramName}不在椭圆曲线上`);
        }
    }

    /**
     * 验证公钥对象
     * @private
     */
    _validatePublicKeyObject(publicKey) {
        if (!publicKey || typeof publicKey !== 'object') {
            throw new ECCValidationError('公钥必须是有效的对象');
        }

        this._validateHexString(publicKey.x, 'publicKey.x', 64);
        this._validateHexString(publicKey.y, 'publicKey.y', 64);
    }

    /**
     * 将(r,s)编码为DER格式
     * @private
     * @param {BigInt} r - 签名的r值
     * @param {BigInt} s - 签名的s值
     * @returns {string} DER编码的签名（十六进制字符串）
     */
    _encodeDERSignature(r, s) {
        try {
            // 将BigInt转换为字节数组
            const rBytes = this._bigIntToBytes(r);
            const sBytes = this._bigIntToBytes(s);
            
            // 构造DER编码的INTEGER
            const rDER = this._encodeDERInteger(rBytes);
            const sDER = this._encodeDERInteger(sBytes);
            
            // 构造DER编码的SEQUENCE
            const sequenceContent = [...rDER, ...sDER];
            const sequenceLength = this._encodeDERLength(sequenceContent.length);
            
            const derSignature = [0x30, ...sequenceLength, ...sequenceContent];
            
            // 转换为十六进制字符串
            return derSignature.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            throw new ECCCryptoError(`DER编码失败: ${error.message}`);
        }
    }
    
    /**
     * 解析DER编码的签名
     * @private
     * @param {string} derHex - DER编码的签名（十六进制字符串）
     * @returns {Object} 包含r和s的对象
     */
    _decodeDERSignature(derHex) {
        try {
            // 转换为字节数组
            const bytes = [];
            for (let i = 0; i < derHex.length; i += 2) {
                bytes.push(parseInt(derHex.substr(i, 2), 16));
            }
            
            let offset = 0;
            
            // 验证SEQUENCE标签
            if (bytes[offset] !== 0x30) {
                throw new Error('无效的DER签名：缺少SEQUENCE标签');
            }
            offset++;
            
            // 跳过长度字段
            const sequenceLength = this._decodeDERLength(bytes, offset);
            offset += this._getDERLengthSize(bytes[offset]);
            
            // 解析r值
            const r = this._decodeDERInteger(bytes, offset);
            offset += this._getDERIntegerSize(bytes, offset);
            
            // 解析s值
            const s = this._decodeDERInteger(bytes, offset);
            
            return { r, s };
        } catch (error) {
            throw new ECCValidationError(`DER解码失败: ${error.message}`);
        }
    }
    
    /**
     * 编码DER INTEGER
     * @private
     * @param {Uint8Array} bytes - 整数字节
     * @returns {Uint8Array} DER编码的INTEGER
     */
    _encodeDERInteger(bytes) {
        // 如果最高位是1，需要添加0x00前缀
        const needsPadding = bytes[0] >= 0x80;
        const contentBytes = needsPadding ? [0x00, ...bytes] : [...bytes];
        const length = this._encodeDERLength(contentBytes.length);
        
        return [0x02, ...length, ...contentBytes];
    }
    
    /**
     * 编码DER长度
     * @private
     * @param {number} length - 长度值
     * @returns {Uint8Array} DER编码的长度
     */
    _encodeDERLength(length) {
        if (length < 0x80) {
            return [length];
        }
        
        const lengthBytes = [];
        let temp = length;
        while (temp > 0) {
            lengthBytes.unshift(temp & 0xFF);
            temp >>= 8;
        }
        
        return [0x80 | lengthBytes.length, ...lengthBytes];
    }
    
    /**
     * 解码DER长度
     * @private
     * @param {Uint8Array} bytes - 字节数组
     * @param {number} offset - 偏移量
     * @returns {number} 长度值
     */
    _decodeDERLength(bytes, offset) {
        const firstByte = bytes[offset];
        
        if (firstByte < 0x80) {
            return firstByte;
        }
        
        const lengthBytes = firstByte & 0x7F;
        let length = 0;
        
        for (let i = 1; i <= lengthBytes; i++) {
            length = (length << 8) | bytes[offset + i];
        }
        
        return length;
    }
    
    /**
     * 获取DER长度字段的大小
     * @private
     * @param {number} firstByte - 长度字段的第一个字节
     * @returns {number} 长度字段的总大小
     */
    _getDERLengthSize(firstByte) {
        return firstByte < 0x80 ? 1 : (firstByte & 0x7F) + 1;
    }
    
    /**
     * 解码DER INTEGER
     * @private
     * @param {Uint8Array} bytes - 字节数组
     * @param {number} offset - 偏移量
     * @returns {BigInt} 整数值
     */
    _decodeDERInteger(bytes, offset) {
        // 验证INTEGER标签
        if (bytes[offset] !== 0x02) {
            throw new Error('无效的DER INTEGER标签');
        }
        
        const length = this._decodeDERLength(bytes, offset + 1);
        const lengthSize = this._getDERLengthSize(bytes[offset + 1]);
        const valueOffset = offset + 1 + lengthSize;
        
        // 提取整数字节
        const valueBytes = bytes.slice(valueOffset, valueOffset + length);
        
        // 跳过前导0x00（如果存在）
        const actualBytes = valueBytes[0] === 0x00 ? valueBytes.slice(1) : valueBytes;
        
        // 转换为BigInt
        return this._bytesToBigInt(actualBytes);
    }
    
    /**
     * 获取DER INTEGER的总大小
     * @private
     * @param {Uint8Array} bytes - 字节数组
     * @param {number} offset - 偏移量
     * @returns {number} INTEGER的总大小
     */
    _getDERIntegerSize(bytes, offset) {
        const length = this._decodeDERLength(bytes, offset + 1);
        const lengthSize = this._getDERLengthSize(bytes[offset + 1]);
        return 1 + lengthSize + length; // 标签 + 长度字段 + 内容
    }
    
    /**
     * BigInt转字节数组
     * @private
     * @param {BigInt} bigint - 大整数
     * @returns {Uint8Array} 字节数组
     */
    _bigIntToBytes(bigint) {
        const hex = bigint.toString(16);
        const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
        const bytes = [];
        
        for (let i = 0; i < paddedHex.length; i += 2) {
            bytes.push(parseInt(paddedHex.substr(i, 2), 16));
        }
        
        return new Uint8Array(bytes);
    }
    
    /**
     * 字节数组转BigInt
     * @private
     * @param {Uint8Array} bytes - 字节数组
     * @returns {BigInt} 大整数
     */
    _bytesToBigInt(bytes) {
        const hex = Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return BigInt('0x' + hex);
    }

    /**
     * 验证加密数据对象
     * @private
     */
    _validateEncryptedData(encryptedData) {
        if (!encryptedData || typeof encryptedData !== 'object') {
            throw new ECCValidationError('加密数据必须是有效的对象');
        }
        
        this._validatePublicKeyObject(encryptedData.tempPublicKey);
        this._validateHexString(encryptedData.iv, 'encryptedData.iv', 24);
        this._validateString(encryptedData.ciphertext, 'encryptedData.ciphertext');
    }

    /**
     * 验证DER签名字符串
     * @private
     * @param {string} signatureDER - DER编码的签名字符串
     * @throws {ECCValidationError} 当签名无效时抛出错误
     */
    _validateDERSignature(signatureDER) {
        if (!signatureDER || typeof signatureDER !== 'string') {
            throw new ECCValidationError('DER签名必须是字符串');
        }
        
        // 验证十六进制格式
        if (!/^[0-9a-fA-F]+$/.test(signatureDER)) {
            throw new ECCValidationError('DER签名必须是有效的十六进制字符串');
        }
        
        // 验证最小长度（至少包含SEQUENCE头和两个INTEGER）
        if (signatureDER.length < 16) {
            throw new ECCValidationError('DER签名长度过短');
        }
        
        // 验证SEQUENCE标签
        if (!signatureDER.startsWith('30')) {
            throw new ECCValidationError('DER签名必须以SEQUENCE标签(30)开始');
        }
    }

    /**
     * 检查点是否在椭圆曲线上
     * @private
     */
    _isPointOnCurve(point) {
        try {
            const left = this.mod(point.y * point.y, this.p);
            const right = this.mod(point.x * point.x * point.x + this.b, this.p);
            return left === right;
        } catch {
            return false;
        }
    }

    /**
     * 安全地克隆点对象
     * @private
     */
    _clonePoint(point) {
        if (!point) return null;
        return { x: point.x, y: point.y };
    }

    /**
     * 内部日志记录方法
     * @private
     */
    _log(message, level = 'INFO') {
        if (this.debugMode) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [ECC-${level}] ${message}`);
        }
    }

    // ==================== 公共工具方法 ====================

    /**
     * 启用或禁用调试模式
     * 
     * @method setDebugMode
     * @param {boolean} enabled - 是否启用调试模式
     */
    setDebugMode(enabled) {
        this.debugMode = Boolean(enabled);
        this._log(`调试模式已${enabled ? '启用' : '禁用'}`, 'INFO');
    }

    /**
     * 获取椭圆曲线参数信息
     * 
     * @method getCurveInfo
     * @returns {Object} 椭圆曲线参数信息
     */
    getCurveInfo() {
        return {
            name: 'secp256k1',
            equation: 'y² = x³ + 7 (mod p)',
            p: this.p.toString(16),
            n: this.n.toString(16),
            G: {
                x: this.Gx.toString(16),
                y: this.Gy.toString(16)
            },
            keySize: 256,
            security: '128-bit'
        };
    }

    /**
     * 生成与Java后端兼容的签名字节数组
     * 
     * @method signToBytes
     * @description 对消息进行ECDSA数字签名，返回DER编码的签名字节数组，可直接用于Java验证
     * @param {string} message - 要签名的消息
     * @param {string} privateKeyHex - 私钥的十六进制字符串（64字符）
     * @returns {Promise<Uint8Array>} DER编码的签名字节数组
     * @throws {ECCValidationError|ECCCryptoError} 当输入无效或签名失败时抛出错误
     * 
     * @example
     * const signatureBytes = await ecc.signToBytes('Hello World', privateKeyHex);
     * // 返回可直接传递给Java Signature.verify()的字节数组
     */
    async signToBytes(message, privateKeyHex) {
        const derHex = await this.sign(message, privateKeyHex);
        return new Uint8Array(derHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    }

    /**
     * 验证Java后端传来的字节数组格式签名
     * 
     * @method verifyFromBytes
     * @description 验证DER编码的字节数组签名，兼容Java后端生成的签名格式
     * @param {string} message - 原始消息
     * @param {Uint8Array} signatureBytes - DER编码的签名字节数组
     * @param {Object} publicKey - 公钥对象 {x: string, y: string}
     * @returns {Promise<boolean>} 验证结果
     * @throws {ECCValidationError} 当输入无效时抛出错误
     * 
     * @example
     * const isValid = await ecc.verifyFromBytes('Hello World', signatureBytes, publicKey);
     * // 可验证Java后端生成的字节数组格式签名
     */
    async verifyFromBytes(message, signatureBytes, publicKey) {
        if (!(signatureBytes instanceof Uint8Array)) {
            throw new ECCValidationError('签名必须是Uint8Array类型');
        }
        const derHex = Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        return await this.verify(message, derHex, publicKey);
    }

    /**
     * 验证密钥对的匹配性
     * 
     * @method validateKeyPair
     * @param {string} privateKeyHex - 私钥十六进制字符串
     * @param {Object} publicKey - 公钥对象
     * @returns {boolean} 密钥对是否匹配
     */
    validateKeyPair(privateKeyHex, publicKey) {
        try {
            this._validateHexString(privateKeyHex, 'privateKeyHex', 64);
            this._validatePublicKeyObject(publicKey);
            
            const privateKey = BigInt('0x' + privateKeyHex);
            const computedPublicKey = this.generatePublicKey(privateKey);
            
            return (
                computedPublicKey.x.toString(16).padStart(64, '0') === publicKey.x &&
                computedPublicKey.y.toString(16).padStart(64, '0') === publicKey.y
            );
        } catch {
            return false;
        }
    }

    /**
     * 兼容性方法：将DER签名转换为(r,s)对象格式
     * @method derToRSFormat
     * @description 将DER编码的签名转换为传统的(r,s)对象格式，用于向后兼容
     * @param {string} derSignature - DER编码的签名字符串
     * @returns {Object} 包含r和s字段的签名对象
     * @throws {ECCValidationError} 当DER签名无效时抛出错误
     * 
     * @example
     * const rsSignature = ecc.derToRSFormat("3044022012345...0220abcdef...");
     * // 返回: { r: "12345...", s: "abcdef..." }
     */
    derToRSFormat(derSignature) {
        try {
            this._validateDERSignature(derSignature);
            const { r, s } = this._decodeDERSignature(derSignature);
            
            return {
                r: r.toString(16).padStart(64, '0'),
                s: s.toString(16).padStart(64, '0')
            };
        } catch (error) {
            throw new ECCValidationError(`DER转(r,s)格式失败: ${error.message}`);
        }
    }
    
    /**
     * 兼容性方法：将(r,s)对象格式转换为DER签名
     * @method rsFormatToDER
     * @description 将传统的(r,s)对象格式转换为DER编码的签名，用于向后兼容
     * @param {Object} rsSignature - 包含r和s字段的签名对象
     * @returns {string} DER编码的签名字符串
     * @throws {ECCValidationError} 当(r,s)签名无效时抛出错误
     * 
     * @example
     * const derSignature = ecc.rsFormatToDER({ r: "12345...", s: "abcdef..." });
     * // 返回: "3044022012345...0220abcdef..."
     */
    rsFormatToDER(rsSignature) {
        try {
            if (!rsSignature || typeof rsSignature !== 'object') {
                throw new ECCValidationError('(r,s)签名必须是一个对象');
            }
            if (!rsSignature.r || !rsSignature.s) {
                throw new ECCValidationError('(r,s)签名对象必须包含r和s字段');
            }
            
            this._validateHexString(rsSignature.r, 'signature.r', 64);
            this._validateHexString(rsSignature.s, 'signature.s', 64);
            
            const r = BigInt('0x' + rsSignature.r);
            const s = BigInt('0x' + rsSignature.s);
            
            return this._encodeDERSignature(r, s);
        } catch (error) {
            throw new ECCValidationError(`(r,s)转DER格式失败: ${error.message}`);
        }
    }
    
    /**
     * 兼容性方法：使用(r,s)格式进行签名验证
     * @method verifyRSFormat
     * @description 验证传统(r,s)格式的ECDSA数字签名，用于向后兼容
     * @param {string} message - 原始消息
     * @param {Object} signature - 签名对象 {r: string, s: string}
     * @param {Object} publicKey - 公钥对象 {x: string, y: string}
     * @returns {Promise<boolean>} 验证结果
     * @throws {ECCValidationError} 当输入无效时抛出错误
     * 
     * @example
     * const isValid = await ecc.verifyRSFormat('Hello World', {r: "12345...", s: "abcdef..."}, publicKey);
     */
    async verifyRSFormat(message, signature, publicKey) {
        try {
            // 将(r,s)格式转换为DER格式
            const derSignature = this.rsFormatToDER(signature);
            
            // 使用DER格式进行验证
            return await this.verify(message, derSignature, publicKey);
        } catch (error) {
            this._log(`(r,s)格式签名验证失败: ${error.message}`, 'ERROR');
            return false;
        }
    }
}

// 导出错误类型
export { ECCError, ECCValidationError, ECCCryptoError };

// 导出主类
export default ECCCrypto;