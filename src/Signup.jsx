import React, { useState } from 'react';
import Navbar from './Navbar';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
function Signup() {
  const [inputPassword, setInputPassword] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  // const [loggedIn, setLoggedIn] = useState(false);
  async function createUser(event) {
    event.preventDefault();
    console.log('in create user front end');
    try {
      await fetch('http://localhost:5001/users/createusers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inputUsername,
          email: inputEmail,
          password: inputPassword,
        }),
      });
      window.location.href = 'http://localhost:3000/';
    } catch (err) {
      console.error('Error in posting');
    }
    // try {
    //     axios.post("https://localhost:5001/users/createusers", {
    //         name: inputUsername,
    //         email: inputEmail,
    //         password: inputPassword
    //     });
    //     setInputUsername(inputUsername)
    //     setInputPassword(inputPassword)
    //     setInputEmail(inputEmail)
    //     setLoggedIn(true) //do we need a conditional here? try testing
    // } catch (err) {
    //     console.error("Error: ", err);
    // }
  }
  return (
    <div>
      <Navbar />
      <h1>Create Account</h1>
      <div className="loginPage">
        <button>ALERTED</button>
        <form onSubmit={createUser}>
          <div className="inputs">
            <input
              type="text"
              name="username"
              placeholder="Username"
              username={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              email={inputEmail}
              onChange={(e) => {
                setInputEmail(e.target.value);
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              password={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
            />
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
