import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://insightdesk-backend-wlrm.onrender.com/api";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

const [loginForm, setLoginForm] = useState({
  email: "",
  password: "",
});

const [loginLoading, setLoginLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    title: "",
    description: "",
    category: "Technical",
    priority: "Medium",
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();

      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/complaints/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchComplaints();
    } catch (error) {
      console.error("Failed to update complaint:", error);
    }
  };

  const handleLoginChange = (e) => {
  setLoginForm({
    ...loginForm,
    [e.target.name]: e.target.value,
  });
};

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoginLoading(true);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setUser(data.user);

    alert("Login successful!");
  } catch (error) {
    console.error("Login failed:", error);
    alert(error.message);
  } finally {
    setLoginLoading(false);
  }
};
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createComplaint = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to create complaint");
      }

      setForm({
        customer_name: "",
        customer_email: "",
        title: "",
        description: "",
        category: "Technical",
        priority: "Medium",
      });

      await fetchComplaints();

      alert("Complaint submitted successfully!");
    } catch (error) {
      console.error("Failed to create complaint:", error);
      alert("Failed to submit complaint.");
    }
  };

  const openCount = complaints.filter(
    (complaint) => complaint.status === "Open"
  ).length;

  const progressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

if (!user) {
  return (
    <div className="app">
      <main className="container">
        <section className="panel">

          <div className="panel-header">
            <h2>Welcome to InsightDesk</h2>
            <p>Login to access the complaint management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="complaint-form">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />

            <button
              type="submit"
              className="submit-button"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>

          </form>

        </section>
      </main>
    </div>
  );
}

  return (
    <div className="app">

      <header className="navbar">
        <div>
          <h1>InsightDesk</h1>
          <p>Complaint Management Dashboard</p>
        </div>

        <button onClick={fetchComplaints}>
          Refresh
        </button>
      </header>

      <main className="container">

        <section className="stats">

          <div className="card">
            <span>Total Complaints</span>
            <strong>{complaints.length}</strong>
          </div>

          <div className="card">
            <span>Open</span>
            <strong>{openCount}</strong>
          </div>

          <div className="card">
            <span>In Progress</span>
            <strong>{progressCount}</strong>
          </div>

          <div className="card">
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>

        </section>

        <section className="panel">

          <div className="panel-header">
            <h2>Submit a Complaint</h2>
            <p>Create a new complaint in the system</p>
          </div>

          <form onSubmit={createComplaint} className="complaint-form">

            <input
              type="text"
              name="customer_name"
              placeholder="Customer Name"
              value={form.customer_name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="customer_email"
              placeholder="Customer Email"
              value={form.customer_email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="title"
              placeholder="Complaint Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Describe the complaint..."
              value={form.description}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button type="submit" className="submit-button">
              Submit Complaint
            </button>

          </form>

        </section>

        <section className="panel">

          <div className="panel-header">
            <h2>Complaints</h2>
            <p>Recent complaints submitted to InsightDesk</p>
          </div>

          {loading ? (
            <div className="message">
              Loading complaints...
            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {complaints.map((complaint) => (

                    <tr key={complaint.id}>

                      <td>#{complaint.id}</td>

                      <td>{complaint.customer_name}</td>

                      <td>{complaint.title}</td>

                      <td>{complaint.category}</td>

                      <td>
                        <span
                          className={`badge priority-${complaint.priority.toLowerCase()}`}
                        >
                          {complaint.priority}
                        </span>
                      </td>

                      <td>
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            updateStatus(
                              complaint.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">
                            In Progress
                          </option>
                          <option value="Resolved">
                            Resolved
                          </option>
                        </select>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default App;