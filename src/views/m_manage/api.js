import createApi from 'root/common/fetch'

const fetchConfig = {
  getWxConfig: 'get /wx/config',
  // urlData: [ hospitalId ] data: {appid, appsecret}
  updateWxConfig: 'post /wx/config',
  // urlData: [ hospitalId ]
  delWxConfig: 'delete /wx/config',
  // data: { hospitalId, buttons}
  updateMenus: 'post /wx/config/updateMenus',
  // urlData: [ hid ]
  getArticles: 'get /wx/config/articles',
  // data: { hid, articles}
  updateArticles: 'post /wx/config/articles',
  // urlData: [ hid, enable ]
  enable: 'post /wx/config/enable',
  // urlData: [ hid ]
  clearWarn: 'post /wx/config/clearwarn',
  // urlData: [ hid ]
  getQrcodeList: 'post /wx/config/listqrcode',
  // urlData: [ hid ]
  uak: 'post /wx/config/uak',
  // urlData: [ hid, scene ]
  createQrcode: 'post /wx/config/qrcode',
  // urlData: [ hid, scene ]
  delQrcode: 'post /wx/config/deleteqrcode',
  // urlData: [ hid, scene ]
  getAccountByUsername: 'get /wx/config/getAccountId',
  // data: { hospitalId }
  getWxAuthUrl: 'get /wx/open/auth',
  // data: { hospitalId }
  scanCompletion: 'get /wx/open/afterScanQrcode',
  // data: { hospitalId }
  getSiteInfo: 'get /wx/config/getsiteinfo',
  // urlData: [ hid ]  data: {title, msg}
  saveMsgQrcode: 'post /wx/config/msgqrcode',
  // urlData: [ hid ]
  listmsgqrcodes: 'post /wx/config/listmsgqrcode',
  // urlData: [ hid, msgid ]
  getmsgqrcode: 'post /wx/config/getqrcodemsg',
  // urlData: [ hid ]  data: { title, msg, scene }
  updatemsgqrcode: 'post /wx/config/updatemsgqrcode',
  // urlData: [ hid ]
  toggletransfercustomerservice: 'post /wx/config/toggletransfercustomerservice',
  // urlData: [ hid ]
  listAutoReply: 'post /wx/config/autoreplys',
  // data: {id, request, content}
  updateAutoReply: 'post /wx/config/updateautoreply',
  // data: {hospitalId, request, content}
  saveAutoReply: 'post /wx/config/saveautoreply',
  // urlData: [ hid ]
  updateTemplate: 'post /wx/config/template/',
  // data: { hospitalId }
  getWxAuthUrlByMove: 'get /wx/transfer/start',
  getColorRule: 'get /colorRule',
  // data: {cssRule}
  updateColorRule: 'post /colorRule',
  getWebCss: 'get /webCss',
  // urlData: {id}
  delTpl: 'delete /delColorTem',
  // data: {siteSubWebCss}
  updateTpl: 'post /webCss',
  // urlData: {hid, title}
  createMsgCodeByImg: 'post /wx/config/imagemsgqrcode',
}

export default createApi(fetchConfig)
