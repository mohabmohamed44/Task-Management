const http = require('http');

http.get('http://localhost:3000/api/tasks?limit=100', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("Tasks array length:", json.data ? json.data.length : (json.tasks ? json.tasks.length : "unknown"));
      const tasks = json.data || json.tasks || [];
      const completedTasks = tasks.filter(t => t.completed);
      console.log("Completed tasks:", completedTasks.length);
      if (completedTasks.length > 0) {
        console.log("Sample completed task dates:", completedTasks.slice(0, 3).map(t => ({
          created: t.created_at || t.createdAt,
          updated: t.updated_at || t.updatedAt
        })));
      }
    } catch (e) {
      console.error(e);
      console.log("Raw output starting:", data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
