useEffect(() => {
  // Fetch dashboard data
  const fetchData = async () => {
    try {
      // Get daily report for system stats
      const report = await reportingService.getDailyReport();
      setPendingTasks(report.total_tasks);
      // Use optional chaining with fallback
      setSystemHealth((report as any).system_health || 98);

      // Get robots for battery level
      const robots = await robotService.getAllRobots();
      setActiveRobots(robots.length);

      const totalBattery = robots.reduce((sum: number, robot: any) => sum + robot.battery_level, 0);
      setAvgBattery(robots.length ? Math.round(totalBattery / robots.length) : 0);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  fetchData();

  // Refresh data every 30 seconds
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);
}, []);