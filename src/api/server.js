import {eccApi} from '@/api/eccApi';
import { SUCCESS_CODES, isSuccessCode } from '../constants/api.js';

class serverService {

    /**
     * 获取服务器公钥
     * 先从本地缓存获取，没有则通过API请求
     */
    async getServerPublicKey() {
        try {
            // 从localStorage尝试获取缓存的公钥
            const cachedKey = localStorage.getItem('serverPublicKey');
            if (cachedKey) {
                try {
                    this.serverPublicKey = JSON.parse(cachedKey);
                    return this.serverPublicKey;
                } catch (e) {
                    // 缓存数据格式错误，清除缓存
                    localStorage.removeItem('serverPublicKey');
                }
            }

            // 通过API请求获取服务器公钥
            const result = await eccApi.getServerPublicKey();
            console.log(result)
            if (isSuccessCode(result.code) && result.publicKey) {
                this.serverPublicKey = result.publicKey;

                // 缓存到localStorage
                localStorage.setItem('serverPublicKey', JSON.stringify(this.serverPublicKey));

                return this.serverPublicKey;
            } else {
                throw new Error(result.error || '服务器返回的公钥格式无效');
            }

        } catch (error) {

            throw error;
        }
    }
}

/**
 * server API服务实例
 *
 * @const {serverApiService} serverService
 * @description server API服务的单例实例
 */
const serverApiService = new serverService();

/**
 * 默认导出 server API服务实例
 */
export default serverApiService;

/**
 * 导出 server API服务类
 */
export { serverService };

/**
 * 用户API快捷方法对象
 *
 * @const {Object} userApi
 * @description 提供用户API的快捷调用方法
 */
export const serverApi = {

    getServerPublicKey: () => serverApiService.getServerPublicKey(),

}

