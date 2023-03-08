const config = Object.freeze({
  firebase: {
    namespace: 'via-wa__'
  },
  whatsappCloudApi: {
    accesToken: process.env.WHATSAPPCLOUDAPI_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPPCLOUDAPI_PHONENUMBER_ID,
    verifyToken: process.env.WHATSAPPCLOUDAPI_VERIFY_TOKEN,
  }
})

export default config;