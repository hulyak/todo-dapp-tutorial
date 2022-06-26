import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./components/Task";
import "./App.css";
import { TaskContractAddress } from "./config";
import { ethers } from "ethers";
const { abi } = require("./abi/TaskContract.json");

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      // user didn't install MetaMask in their browser
      if (!ethereum) {
        console.log("No Metamask detected");
      }
      // check which network is connected
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:", chainId);

      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        alert('Please connect to the "Goerli" network');
        return;
      } else {
        setCorrectNetwork(true);
      }

      // get the current account
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log("Connected to account:", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to wallet", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          abi,
          signer
        );

        // smart contract function call
        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((result) => {
            // append new task to the list of tasks
            setTasks([...tasks, result]);
          })
          .catch((error) => {
            console.error("Error occurred while adding a new task", error);
          });
      } else {
        console.log("Ethereum is not available");
      }
    } catch (e) {
      console.log("error submitting the task", e);
    }
    // clear the input fields
    setInput("");
  };

  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          abi,
          signer
        );

        // is deleted is true
        await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum is not available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          abi,
          signer
        );

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum is not available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
    connectWallet();
  }, []);

  return (
    <>
      {currentAccount === "" ? (
        <center>
          <button className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </center>
      ) : correctNetwork ? (
        <div className="App">
          <h2>To-do dApp</h2>
          <form>
            <TextField
              id="outlined-basic"
              label="My Todos"
              variant="outlined"
              style={{ margin: "0 10px" }}
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></TextField>

            <Button variant="contained" color="primary" onClick={addTask}>
              Add Task
            </Button>
          </form>

          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
              ></Task>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <p>Please connect to the Goerli Testnet and reload the page.</p>
        </div>
      )}
    </>
  );
};

export default App;
