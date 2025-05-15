class ValidateAccessToken {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }

    async execute(accessToken) {
        this.jwtService.verify(accessToken);
    }
}

export default ValidateAccessToken;

