import { useState } from "react";

export const SignupView = () => {
  const [FullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch("https://mymovies-8b73c95d0ae4.herokuapp.com/users/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        alert("Signup successful");
        window.location.reload();
      } else {
        alert("Signup failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
        <label>
        Full Name:
        <input
          type="text"
          value={FullName}
          placeholder="First & Last Name"
          onChange={(e) => setFullName(e.target.value)}
          required

          />
      </label>

      <label>
        Username:
        <input
          type="text"
          value={username}
          minLength="6"
          pattern="^[a-zA-Z0-9]+$"
          title="Username can only contain letters and numbers"
          onChange={(e) => setUsername(e.target.value)}
          required
          
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          minLength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
          title="Must contain at least one number and one uppercase and lowercase letter, and at least one special character."
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
