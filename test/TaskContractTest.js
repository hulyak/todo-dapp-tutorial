const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task Contract", function () {
  let TaskContract;
  // instance of the contract
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 3;

  let totalTasks;

  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    totalTasks = [];

    // generate dummy task
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task = {
        taskText: "Task Number -" + i,
        isDeleted: false,
      };

      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  });

  describe("Add Task", function () {
    it("Should emit AddTask event", async function () {
      let task = {
        taskText: "New Task",
        isDeleted: false,
      };

      await expect(await taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_TOTAL_TASKS);
    });
  });

  describe("Get All Tasks", function () {
    it("Should return the correct number of total tasks", async function () {
      const tasksFromChain = await taskContract.getMyTasks();
      expect(tasksFromChain.length).to.equal(NUM_TOTAL_TASKS);
    });
  });

  describe("Delete Task", function () {
    it("Should emit delete task event", async function () {
      const TASK_ID = 0;
      const TASK_DELETED = true;

      await expect(taskContract.deleteTask(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED);
    });
  });
});
