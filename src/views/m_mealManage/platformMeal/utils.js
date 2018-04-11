// 获取性别
export const getGender = d => ({ 'g0': '男', 'g1': '女', 'g2': '通用' }[`g${d}`] || '未知')
// 格式化价格
export const formatPrice = d => `￥${d}`
