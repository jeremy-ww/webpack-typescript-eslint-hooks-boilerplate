module.exports = {
  all: true,
  exclude: ['src/**/__tests__/'],
  include: ['src'],
  reporter: process.env.CI ? ['html', 'lcov'] : ['html'],
}
