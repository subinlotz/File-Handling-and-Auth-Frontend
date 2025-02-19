import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    try {
      const req = await fetch("https://file-handling-and-auth-backend.onrender.com/read", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });      

      const data = await req.json();
      console.log(data);
      
      if (data.status === 'ok') {
        setQuote(data.quote.quote)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        populateQuote();
      }
    }
  }, [navigate]);

  async function updateQuote(e){
    e.preventDefault();
    const req = await fetch("https://file-handling-and-auth-backend.onrender.com/save", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),    
    });

    const data = await req.json();
    if (data.message === 'Data saved successfully') {
      setQuote(tempQuote)
      setTempQuote('')
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="quote-container">
      <p className="quote-output">
        Your Quote is: <span>{quote}</span> 
      </p>
      <form onSubmit={updateQuote}>
      <input
        type="text"
        placeholder="Type your quote here..."
        value={tempQuote}
        onChange={(e) => setTempQuote(e.target.value)}
      />
      <input type="submit" value="Update Quote" />
      </form>
      
    </div>
  );
};

export default Dashboard;
