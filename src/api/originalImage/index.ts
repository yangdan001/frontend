import request from '@/axios/service'


export const getImageUrl = ( queryParams: any = {}) =>
    request.get('/api', queryParams);