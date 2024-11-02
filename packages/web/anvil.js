import { exec } from "node:child_process";

const anvil = exec("anvil");

anvil.stdout.on("data", (data) => {
  console.log(data.toString());
});

anvil.stderr.on("data", (data) => {
  console.error(data.toString());
});
