const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Запуск тестов</title>
        <style>
          body { font-family: Arial; padding:20px; }
          #loading {
            display: none;
            margin-top: 20px;
            font-size: 16px;
            color: #555;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <h1>🚀 Запуск Postman тестов</h1>
        <button id="btn" onclick="runTests()" style="padding:10px 20px; font-size:16px;">Запустить тесты</button>
        
        <div id="loading">
          <span class="spinner"></span> Выполняется запуск тестов...
        </div>

        <script>
          function runTests() {
            document.getElementById('btn').disabled = true; // блокируем повторные клики
            document.getElementById('loading').style.display = 'block';

            fetch('/run-tests')
              .then(() => window.location.href = '/report.html')
              .catch(err => {
                alert('Ошибка: ' + err);
                document.getElementById('btn').disabled = false;
                document.getElementById('loading').style.display = 'none';
              });
          }
        </script>
      </body>
    </html>
  `);
});

app.get("/run-tests", (req, res) => {
  const reportPath = path.join(__dirname, "report.html");

  const command = `npx newman run batmanenv2.json -e qaenv.json -r htmlextra --reporter-htmlextra-export ${reportPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка запуска: ${error.message}`);
      console.error(`STDERR: ${stderr}`);
      return res.status(500).send(`Ошибка при запуске тестов: ${stderr}`);
    }

    console.log(stdout);
    res.send("✅ Тесты завершены. Открываю отчет...");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
