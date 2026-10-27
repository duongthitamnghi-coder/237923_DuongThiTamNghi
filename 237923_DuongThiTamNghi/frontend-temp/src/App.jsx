import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees'

function App() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(API_URL, {
        params: search ? { search } : {}
      })
      setEmployees(response.data.data || [])
    } catch {
      setError('Không thể tải danh sách nhân viên. Hãy kiểm tra Backend API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>Quản lý nhân viên</h1>
          <p>Mã sinh viên: 237923 · Dương Thị Tâm Nghi</p>
        </div>
      </header>

      <section className="panel">
        <div className="toolbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadEmployees()}
            placeholder="Tìm tên, email, mã nhân viên..."
          />
          <button onClick={loadEmployees}>Tìm kiếm</button>
          <button className="secondary" onClick={() => {
            setSearch('')
            setTimeout(loadEmployees, 0)
          }}>
            Làm mới
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {loading && <p>Đang tải dữ liệu...</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Chức vụ</th>
                <th>Phòng ban</th>
                <th>Lương</th>
              </tr>
            </thead>
            <tbody>
              {!loading && employees.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">
                    {error ? 'Chưa tải được dữ liệu.' : 'Chưa có nhân viên.'}
                  </td>
                </tr>
              )}
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>
                    {Number(employee.salary || 0).toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="count">Tổng số nhân viên: {employees.length}</p>
      </section>
    </main>
  )
}

export default App
