import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import {
  FiUsers,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiPieChart,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import styles from "./MealAttendance.module.css";

const MealAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await adminAPI.getMealAttendance({ date: dateStr });
      if (response.data.success) {
        setAttendance(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getAttendanceStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handlePrevDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const tomorrow = addDays(new Date(), 1);
    if (addDays(selectedDate, 1) <= tomorrow) {
      setSelectedDate((prev) => addDays(prev, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: "🌅",
      lunch: "☀️",
      snacks: "🍪",
      dinner: "🌙",
    };
    return icons[mealType] || "🍽️";
  };

  const getAttendanceByMeal = (mealType) => {
    return attendance.filter((a) => a.meal_type === mealType);
  };

  const mealTypes = ["breakfast", "lunch", "snacks", "dinner"];

  if (loading && attendance.length === 0) {
    return (
      <AdminLayout>
        <Loader fullScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Meal Attendance</h1>
            <p>Track how many students will eat each meal</p>
          </div>
          <Button icon={FiRefreshCw} variant="ghost" onClick={fetchAttendance}>
            Refresh
          </Button>
        </header>

        {/* Weekly Stats */}
        {stats && (
          <Card className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <FiPieChart />
              <h3>This Week's Summary</h3>
            </div>
            <div className={styles.statsGrid}>
              {mealTypes.map((meal) => (
                <div key={meal} className={styles.statItem}>
                  <span className={styles.mealEmoji}>{getMealIcon(meal)}</span>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>
                      {stats[meal]?.totalResponses || 0}
                    </span>
                    <span className={styles.statLabel}>
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Date Selector */}
        <div className={styles.dateSelector}>
          <Button icon={FiChevronLeft} variant="ghost" onClick={handlePrevDay} />
          <div className={styles.dateDisplay}>
            <FiCalendar />
            <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <Button icon={FiChevronRight} variant="ghost" onClick={handleNextDay} />
          <Button size="sm" variant="secondary" onClick={handleToday}>
            Today
          </Button>
        </div>

        {/* Attendance by Meal Type */}
        <div className={styles.mealsGrid}>
          {mealTypes.map((meal) => {
            const mealAttendance = getAttendanceByMeal(meal);
            const willEat = mealAttendance.filter((a) => a.will_eat).length;
            const wontEat = mealAttendance.filter((a) => !a.will_eat).length;

            return (
              <Card key={meal} className={styles.mealCard}>
                <div className={styles.mealHeader}>
                  <span className={styles.mealEmoji}>{getMealIcon(meal)}</span>
                  <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                </div>

                <div className={styles.attendanceStats}>
                  <div className={styles.attendanceStat}>
                    <div className={`${styles.statCircle} ${styles.eating}`}>
                      <FiUsers />
                    </div>
                    <div>
                      <span className={styles.attendanceValue}>{willEat}</span>
                      <span className={styles.attendanceLabel}>Will Eat</span>
                    </div>
                  </div>
                  <div className={styles.attendanceStat}>
                    <div className={`${styles.statCircle} ${styles.notEating}`}>
                      <FiUsers />
                    </div>
                    <div>
                      <span className={styles.attendanceValue}>{wontEat}</span>
                      <span className={styles.attendanceLabel}>Won't Eat</span>
                    </div>
                  </div>
                </div>

                {mealAttendance.length > 0 && (
                  <div className={styles.studentList}>
                    <h4>Students Eating ({willEat})</h4>
                    <div className={styles.avatarGroup}>
                      {mealAttendance
                        .filter((a) => a.will_eat)
                        .slice(0, 5)
                        .map((a, idx) => (
                          <div
                            key={idx}
                            className={styles.avatar}
                            title={a.students?.name}
                          >
                            {a.students?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        ))}
                      {willEat > 5 && (
                        <div className={styles.moreCount}>+{willEat - 5}</div>
                      )}
                    </div>
                  </div>
                )}

                {mealAttendance.length === 0 && (
                  <p className={styles.noData}>No responses yet</p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Detailed List */}
        {attendance.length > 0 && (
          <Card className={styles.detailsCard}>
            <h3>Detailed Responses</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Meal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className={styles.studentCell}>
                          <div className={styles.miniAvatar}>
                            {item.students?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          {item.students?.name || "Unknown"}
                        </div>
                      </td>
                      <td>{item.students?.roll_number}</td>
                      <td>
                        <span className={styles.mealBadge}>
                          {getMealIcon(item.meal_type)} {item.meal_type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            item.will_eat ? styles.eating : styles.notEating
                          }`}
                        >
                          {item.will_eat ? "Will Eat" : "Won't Eat"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default MealAttendance;
