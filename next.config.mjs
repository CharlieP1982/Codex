/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/.prisma/client/**/*',
      './node_modules/@prisma/client/**/*',
      './node_modules/@prisma/adapter-libsql/**/*',
      './node_modules/@libsql/**/*',
      './node_modules/libsql/**/*',
    ],
  },
};
export default config;
