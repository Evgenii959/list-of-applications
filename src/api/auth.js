export default function (instance) {
  return {
    signIn(payload) {
      return instance.post('api/auth/login', payload);
    },
  };
}
