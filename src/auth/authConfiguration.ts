export const jwtConstants = {
    // ToDo: store in environment...
    // secret: 'secretKey',
    secret: process.env.JWT_SECRET || 'secretKey',
    signOptions: { expiresIn: '3600s' },
    ignoreExpiration: false,
  };