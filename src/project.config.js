const isProductMode = ['production', 'prod'].includes(process.env.NODE_ENV)

let configs = {
  BASE_URL: '',
  DEV_REQUEST_URL: 'https://sti.aigauss.com/sti',
  TEST_REQUEST_URL: 'TEST',
  PRODUCT_REQUEST_URL: 'https://sti.aigauss.com/sti'
}

if (isProductMode) {
  configs.BASE_URL = configs.PRODUCT_REQUEST_URL
} else {
  configs.BASE_URL = configs.DEV_REQUEST_URL
}

export default configs
