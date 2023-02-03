// import { uniqueId } from "lodash";
import { v4 as uuid } from "uuid";

let users = [
  {
    Name: "Varun Agrawal",
    Email: "Varun@123.com",
    Contact: "000999888",
    id: "varun-agwal",
  },
  {
    Name: "Bunti Agrawal",
    Email: "Bunti@123.com",
    Contact: "123456",
    id: "fsad-f-sdf-asd-f-fdas",
  },
  {
    Name: " Agrawal",
    Email: "agrawal@123.com",
    Contact: "11223344",
    id: "dfs-asdf-as-f-sdfa",
  },
];

export const getUsers = (req, res) => {
  res.send(users);
};

export const createUser = (req, res) => {
  const user = req.body;
  console.log(user);

  users.push({ ...user, id: uuid() });
  res.send("User Added Sucessfully");
};

//for getting the info of single user

export const singleUser = (req, res) => {
  const userinfo = users.filter((user) => user.id === req.params.id);
  res.send(userinfo);
};

export const deleteUser = (req, res) => {
  users = users.filter((user) => user.id !== req.params.id);
  res.send(users);
  res.send("user deleted sucessfully");
};

export const updateUser = (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  user.Name = req.body.Name;
  user.Email = req.body.Email;
  user.Contact = req.body.Contact;

  res.send("user Updated sucessfully");
};
