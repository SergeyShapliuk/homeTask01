import jwt from "jsonwebtoken";


export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign({userId},'createToken-for-me', {
            expiresIn: 300
        });
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, 'createToken-for-me') as { userId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    }
};
