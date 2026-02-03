import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  FiCheck, 
  FiX, 
  FiClock,
  FiSunrise,
  FiSun,
  FiCoffee,
  FiMoon,
  FiCalendar
} from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import { attendanceAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Attendance.module.css'

// Helper functions for localStorage persistence
const getLocalStorageKey = (userId) => `attendance_${userId}_${format(new Date(), 'yyyy-MM-dd')}`

const saveToLocalStorage = (userId, status) => {
  try {
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(status))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

const loadFromLocalStorage = (userId) => {
  try {
    const data = localStorage.getItem(getLocalStorageKey(userId))
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Error loading from localStorage:', e)
    return null
  }
}

const Attendance = () => {
  const { user } = useAuth()
  const [todayStatus, setTodayStatus] = useState({})
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(null)

  const meals = [
    { type: 'breakfast', label: 'Breakfast', icon: FiSunrise, time: '7:30 AM - 9:30 AM', emoji: '🌅' },
    { type: 'lunch', label: 'Lunch', icon: FiSun, time: '12:30 PM - 2:30 PM', emoji: '☀️' },
    { type: 'snacks', label: 'Snacks', icon: FiCoffee, time: '5:00 PM - 6:00 PM', emoji: '🍪' },
    { type: 'dinner', label: 'Dinner', icon: FiMoon, time: '7:30 PM - 9:30 PM', emoji: '🌙' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // First, load from localStorage as immediate fallback
      const cachedStatus = loadFromLocalStorage(user.id)
      console.log('📦 Cached status from localStorage:', cachedStatus)
      if (cachedStatus) {
        setTodayStatus(cachedStatus)
      }
      
      // Fetch today's status from server
      console.log('🔄 Fetching today status for user:', user.id)
      const statusRes = await attendanceAPI.getTodayStatus(user.id)
      console.log('📥 Server response:', statusRes.data)
      
      if (statusRes.data.success) {
        const serverStatus = statusRes.data.data
        console.log('✅ Server status data:', serverStatus)
        
        // Check if server returned any marked meals
        const hasMarkedMeals = Object.values(serverStatus).some(status => status !== null)
        console.log('🍽️ Has marked meals:', hasMarkedMeals)
        
        // Only use server data if it has marked meals OR if we have no cached data
        // This prevents empty server response (due to timezone) from clearing valid local data
        if (hasMarkedMeals) {
          setTodayStatus(serverStatus)
          saveToLocalStorage(user.id, serverStatus)
        } else if (!cachedStatus) {
          // No cached data and no server data - set empty
          setTodayStatus(serverStatus)
        }
        // If server has no data but we have cache, keep the cache (already set above)
      }

      // Fetch history (last 7 days)
      const historyRes = await attendanceAPI.getMyAttendance(user.id, {
        startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
      })
      if (historyRes.data.success) {
        console.log('📊 History data:', historyRes.data.data)
        setHistory(historyRes.data.data)
      }
    } catch (error) {
      console.error('❌ Error fetching attendance:', error)
      console.error('❌ Error response:', error.response?.data)
      // If server fails, use localStorage data
      const cachedStatus = loadFromLocalStorage(user.id)
      if (cachedStatus) {
        setTodayStatus(cachedStatus)
        toast.error('Using cached data - server unavailable')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (mealType, status) => {
    try {
      setMarking(mealType)
      const response = await attendanceAPI.markAttendance({
        studentId: user.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        mealType,
        status
      })

      if (response.data.success) {
        const updatedStatus = {
          ...todayStatus,
          [mealType]: status
        }
        setTodayStatus(updatedStatus)
        // Save to localStorage for persistence on refresh
        saveToLocalStorage(user.id, updatedStatus)
        toast.success(`Marked as ${status} for ${mealType}`)
      }
    } catch (error) {
      toast.error('Failed to mark attendance')
    } finally {
      setMarking(null)
    }
  }

  const getStatusClass = (status) => {
    if (status === 'present') return styles.present
    if (status === 'absent') return styles.absent
    return styles.notMarked
  }

  const getStatusIcon = (status) => {
    if (status === 'present') return <FiCheck />
    if (status === 'absent') return <FiX />
    return <FiClock />
  }

  // Get stats from history
  const getStats = () => {
    const stats = { present: 0, absent: 0, total: 0 }
    history.forEach(record => {
      stats.total++
      if (record.status === 'present') stats.present++
      if (record.status === 'absent') stats.absent++
    })
    return stats
  }

  const stats = getStats()

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Meal Attendance</h1>
            <p>Mark your attendance for today's meals</p>
          </div>
          <div className={styles.dateDisplay}>
            <FiCalendar />
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </header>

        {/* Today's Attendance */}
        <section className={styles.todaySection}>
          <h2>Today's Meals</h2>
          <div className={styles.mealsGrid}>
            {meals.map(meal => {
              const status = todayStatus[meal.type]
              const MealIcon = meal.icon
              
              return (
                <Card key={meal.type} className={`${styles.mealCard} ${getStatusClass(status)}`}>
                  <div className={styles.mealHeader}>
                    <span className={styles.mealEmoji}>{meal.emoji}</span>
                    <div className={styles.mealInfo}>
                      <h3>{meal.label}</h3>
                      <span className={styles.mealTime}>{meal.time}</span>
                    </div>
                  </div>

                  <div className={styles.statusDisplay}>
                    {status ? (
                      <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
                        {getStatusIcon(status)}
                        {status === 'present' ? 'Will Attend' : 'Will Not Attend'}
                      </span>
                    ) : (
                      <span className={styles.statusBadge}>
                        <FiClock /> Not Marked
                      </span>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <Button
                      variant={status === 'present' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => handleMarkAttendance(meal.type, 'present')}
                      loading={marking === meal.type}
                      disabled={marking !== null}
                      className={styles.presentBtn}
                    >
                      <FiCheck /> Present
                    </Button>
                    <Button
                      variant={status === 'absent' ? 'danger' : 'outline'}
                      size="small"
                      onClick={() => handleMarkAttendance(meal.type, 'absent')}
                      loading={marking === meal.type}
                      disabled={marking !== null}
                      className={styles.absentBtn}
                    >
                      <FiX /> Absent
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Attendance Stats */}
        <section className={styles.statsSection}>
          <h2>Last 7 Days Summary</h2>
          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total Marked</span>
            </Card>
            <Card className={`${styles.statCard} ${styles.statPresent}`}>
              <span className={styles.statValue}>{stats.present}</span>
              <span className={styles.statLabel}>Present</span>
            </Card>
            <Card className={`${styles.statCard} ${styles.statAbsent}`}>
              <span className={styles.statValue}>{stats.absent}</span>
              <span className={styles.statLabel}>Absent</span>
            </Card>
            <Card className={styles.statCard}>
              <span className={styles.statValue}>
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
              </span>
              <span className={styles.statLabel}>Attendance Rate</span>
            </Card>
          </div>
        </section>

        {/* Recent History */}
        {history.length > 0 && (
          <section className={styles.historySection}>
            <h2>Recent History</h2>
            <Card className={styles.historyCard}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Meal</th>
                    <th>Status</th>
                    <th>Marked At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 10).map(record => (
                    <tr key={record.id}>
                      <td>{format(new Date(record.date), 'MMM dd')}</td>
                      <td className={styles.mealCell}>
                        {meals.find(m => m.type === record.meal_type)?.emoji} {record.meal_type}
                      </td>
                      <td>
                        <span className={`${styles.historyStatus} ${getStatusClass(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </td>
                      <td className={styles.timeCell}>
                        {format(new Date(record.marked_at), 'hh:mm a')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>
        )}
      </div>
    </Layout>
  )
}

export default Attendance
