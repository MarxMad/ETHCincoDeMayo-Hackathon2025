// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Scholarship is ERC20, Ownable {
    struct Task {
        string description;
        bool completed;
        uint256 reward;
    }

    struct Student {
        bool isRegistered;
        uint256 balance;
        mapping(uint256 => bool) completedTasks;
    }

    mapping(address => Student) public students;
    Task[] public tasks;
    mapping(address => bool) public approvedCafeterias;

    event TaskCompleted(address indexed student, uint256 taskId, uint256 reward);
    event CafeteriaApproved(address indexed cafeteria);
    event CafeteriaRemoved(address indexed cafeteria);
    event PurchaseMade(address indexed student, address indexed cafeteria, uint256 amount);

    constructor() ERC20("UniFood Token", "UFT") {
        // Inicializar tareas básicas
        tasks.push(Task("Completar curso introductorio", false, 100));
        tasks.push(Task("Participar en evento universitario", false, 50));
        tasks.push(Task("Mantener promedio académico", false, 200));
    }

    function registerStudent() external {
        require(!students[msg.sender].isRegistered, "Ya estás registrado");
        students[msg.sender].isRegistered = true;
    }

    function completeTask(uint256 taskId) external {
        require(students[msg.sender].isRegistered, "No estás registrado");
        require(taskId < tasks.length, "Tarea no existe");
        require(!students[msg.sender].completedTasks[taskId], "Tarea ya completada");

        students[msg.sender].completedTasks[taskId] = true;
        uint256 reward = tasks[taskId].reward;
        _mint(msg.sender, reward);
        students[msg.sender].balance += reward;

        emit TaskCompleted(msg.sender, taskId, reward);
    }

    function approveCafeteria(address cafeteria) external onlyOwner {
        approvedCafeterias[cafeteria] = true;
        emit CafeteriaApproved(cafeteria);
    }

    function removeCafeteria(address cafeteria) external onlyOwner {
        approvedCafeterias[cafeteria] = false;
        emit CafeteriaRemoved(cafeteria);
    }

    function makePurchase(address cafeteria, uint256 amount) external {
        require(students[msg.sender].isRegistered, "No estás registrado");
        require(approvedCafeterias[cafeteria], "Cafetería no aprobada");
        require(students[msg.sender].balance >= amount, "Saldo insuficiente");

        students[msg.sender].balance -= amount;
        _transfer(msg.sender, cafeteria, amount);

        emit PurchaseMade(msg.sender, cafeteria, amount);
    }

    function getStudentBalance(address student) external view returns (uint256) {
        return students[student].balance;
    }

    function isTaskCompleted(address student, uint256 taskId) external view returns (bool) {
        return students[student].completedTasks[taskId];
    }
} 