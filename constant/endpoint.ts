
export const endpoints = {
    //auth
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    google_login: '/auth/google',
    refresh_token: '/auth/refresh',
    change_password: '/auth/change-password',
    me: '/auth/me',
    logout_all: '/auth/logout-all',

    //verification
    sendEmailOtp: '/verify/send-email-otp',
    sendPhoneOtp: '/verify/send-phone-otp',
    verifyOtp: '/verify/verify-otp',

    //dashboard
    dashboard: '/seller/dashboard',
    profile: '/seller/profile',
    getstore: '/seller/stores',
    getstorebyid: '/seller/stores/:id',
    createstore: '/seller/stores',
    updatestore: '/seller/stores/:id',
    deletestore: '/seller/stores/:id',

    //kyc
    getstatus: '/seller/kyc/status',
    getpan: '/seller/kyc/pan',
    getaadhaar: '/seller/kyc/aadhaar',
    getbank: '/seller/kyc/bank',
    submitpan: '/seller/kyc/pan',
    submitaadhaar: '/seller/kyc/aadhaar',
    submitbank: '/seller/kyc/bank',
    updatepan: '/seller/kyc/pan',
    updateaadhaar: '/seller/kyc/aadhaar',
    updatebank: '/seller/kyc/bank',
    deletepan: '/seller/kyc/pan',
    deleteaadhaar: '/seller/kyc/aadhaar',
    deletebank: '/seller/kyc/bank',

    //products
    products: '/seller/products',
    getproducts: '/seller/products',
    getproductbyid: '/seller/products/:id',
    createproduct: '/seller/products',
    updateproduct: '/seller/products/:id',
    deleteproduct: '/seller/products/:id',

    //orders
    getOrders: '/seller/orders',
    getorders: '/seller/orders',
    getorderbyid: '/seller/orders/:id',
    updateorderstatus: '/seller/orders/:id/status',

    //payouts - new comprehensive payout endpoints
    getearnings: '/payouts/earnings',
    getearningsbystore: '/payouts/earnings/by-store',
    getpayouts: '/payouts',
    getpayoutbyid: '/payouts/:id',
    requestpayout: '/payouts/request',

    //documents
    getdocuments: '/seller/documents',
    uploaddocument: '/seller/documents',
    deletedocument: '/seller/documents/:id',

    //addresses
    getaddresses: '/addresses',
    getaddressbyid: '/addresses/:id',
    createaddress: '/addresses',
    updateaddress: '/addresses/:id',
    deleteaddress: '/addresses/:id',

    //reviews
    getstorereviews: '/reviews/stores/:id',
    getreviewbyid: '/reviews/:id',

}

