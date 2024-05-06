async function getData() {
  let response = await fetch("http://localhost:3000/students");
  let data = await response.json();
  console.log(data);
}

getData();
