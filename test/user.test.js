const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

describe("Cadastro de usuário", () => {
  test("Deve cadastrar um usuário com sucesso", () => {
    var user = {
      name: "usuario-novo",
      email: `${Date.now()}@email.com`,
      password: "senha",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(user.email);
      })
      .catch((err) => {
        fail(err);
      });
  });

  test("Deve recusar cadastro de usuário com dados vazios", () => {
    var user = {
      name: "",
      email: "",
      password: "",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
      })
      .catch((err) => {
        fail(err);
      });
  });

  test("Deve impedir o cadastro de usuário com e-mail já cadastrado", () => {
    var user = {
      name: "usuario-repetido",
      email: `${Date.now()}@email.com`,
      password: "senha",
    };

    return request
      .post("/user")
      .send(user)
      .then(() => {
        
        return request
          .post("/user")
          .send(user)
          .then((res) => {
            expect(res.statusCode).toEqual(400);
            expect(res.body.err).toEqual("E-mail já cadastrado");
          })
          .catch((err) => {
            fail(err);
          });

      })
      .catch((err) => {
        fail(err);
      });
  });
});