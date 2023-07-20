/**
 * Swagger Config
 *
 */

module.exports = () => ({
  swaggerDefinition: {
    info: {
      title: 'API Document',
      version: '1.0.0',
      description: 'Analytics API swagger documentation',
    },
    // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
    components: {
      res: {
        BadRequest: {
          description: 'BadRequest',
          schema: {
            $ref: '#/components/errorResult/Error',
          },
        },
        Forbidden: {
          description: 'Forbidden',
          schema: {
            $ref: '#/components/errorResult/Error',
          },
        },
        NotFound: {
          description: 'NotFound',
          schema: {
            $ref: '#/components/errorResult/Error',
          },
        },
      },
      errorResult: {
        Error: {
          type: 'object',
          properties: {
            errMsg: {
              type: 'string',
              description: '에러 메시지 전달.',
            },
          },
        },
      },
    },
  },
  // apis: [`${__dirname}/../api/**/*.controller.js`]
  apis: [`${__dirname}/../../docs/**/*.docs.js`],
  // apis: [`${__dirname}/../../docs/**/*.specs.yaml`],
});
