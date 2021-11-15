const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

const testUser = {
  name: "Testando",
  email: `${Date.now()}@email.com`,
  password: "teste"
}

afterAll(()=>{
  return request.delete(`/user/${testUser.email}`).then(()=>{})
})

describe("Cadastro de usuário", () => {
  test("Deve cadastrar um usuário com sucesso", () => {
    
    return request
      .post("/user")
      .send(testUser)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(testUser.email);
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
    
    return request
      .post("/user")
      .send(testUser)
      .then(() => {
        
        return request
          .post("/user")
          .send(testUser)
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

describe("Autenticação", () => {

  test("Deve retornar um token ao logar", () => {
    return request.post("/auth").send(testUser).then(res =>{
      expect(res.statusCode).toEqual(200)
      expect(res.body.token).toBeDefined()
    }).catch(err =>{
      throw new Error(err)
    })
  })

  test("Deve impedir que um usuário não cadastrado se logue", () => {
    return request.post("/auth").send({email: "qualquer@qualquer.com", senha: "senha"}).then(res =>{
      expect(res.statusCode).toEqual(403)
      expect(res.body.errors.email).toEqual("E-mail não cadastrado")
    }).catch(err =>{
      throw new Error(err)
    })
  })

  test("Deve impedir que um usuário se logue com uma senha errada", () => {
    return request.post("/auth").send({email: testUser.email, senha: "senha"}).then(res =>{
      expect(res.statusCode).toEqual(403)
      expect(res.body.errors.password).toEqual("Senha incorreta")
    }).catch(err =>{
      throw new Error(err)
    })
  })

})