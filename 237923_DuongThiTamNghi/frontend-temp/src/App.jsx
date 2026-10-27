
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees'

const emptyForm = {
  employeeId: '',
  fullName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  salary: '',
}

function App() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [viewEmployee, setViewEmployee] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadEmployees = async (keyword = search) => {
    try {
      setLoading(true)
      setError('')
      const response = await axios.get(API_URL, {
        params: keyword.trim() ? { search: keyword.trim() } : {},
      })
      const data = response.data.data ?? response.data
      setEmployees(Array.isArray(data) ? data : [])
    } catch {
      setError('Không thể tải danh sách. Hãy kiểm tra Backend API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees('')
  }, [])

  const updateField = (e) => {
    const { name, value } = e.target
    setForm((old) => ({ ...old, [name]: value }))
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
    setNotice('')
  }

  const openEditForm = (employee) => {
    setEditingId(employee._id)
    setForm({
      employeeId: employee.employeeId ?? '',
      fullName: employee.fullName ?? '',
      email: employee.email ?? '',
      phone: employee.phone ?? '',
      position: employee.position ?? '',
      department: employee.department ?? '',
      salary: employee.salary ?? '',
    })
    setShowForm(true)
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveEmployee = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setNotice('')

      const payload = {
        ...form,
        salary: form.salary === '' ? 0 : Number(form.salary),
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload)
        setNotice('Cập nhật nhân viên thành công.')
      } else {
        await axios.post(API_URL, payload)
        setNotice('Thêm nhân viên thành công.')
      }

      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      await loadEmployees('')
      setSearch('')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Lưu thất bại. Hãy kiểm tra dữ liệu và API Backend.'
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteEmployee = async (employee) => {
    const confirmed = window.confirm(
      `Em có chắc muốn xóa nhân viên "${employee.fullName}" (${employee.employeeId}) không?`
    )
    if (!confirmed) return

    try {
      setError('')
      setNotice('')
      await axios.delete(`${API_URL}/${employee._id}`)
      setNotice('Xóa nhân viên thành công.')
      await loadEmployees()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Xóa thất bại. Hãy kiểm tra API Backend.'
      )
    }
  }

  const resetList = () => {
    setSearch('')
    setNotice('')
    loadEmployees('')
  }

  const formatSalary = (salary) =>
    `${Number(salary || 0).toLocaleString('vi-VN')} ₫`

  return (
    <main className="container">
      <header className="header">
        <div className="brand-mark">NS</div>
        <div>
          <p className="eyebrow">HỆ THỐNG QUẢN TRỊ</p>
          <h1>Quản lý nhân viên</h1>
          <p className="student-info">
            Mã sinh viên: 237923 · Dương Thị Tâm Nghi
          </p>
        </div>
      </header>

      {notice && <div className="notice">{notice}</div>}
      {error && <div className="error">{error}</div>}

      {showForm && (
        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THÔNG TIN NHÂN SỰ</p>
              <h2>{editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
            </div>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setForm(emptyForm)
              }}
            >
              Đóng
            </button>
          </div>

          <form onSubmit={saveEmployee}>
            <div className="form-grid">
              <label>
                Mã nhân viên *
                <input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={updateField}
                  placeholder="Ví dụ: NV004"
                  required
                />
              </label>
              <label>
                Họ và tên *
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Nhập họ và tên"
                  required
                />
              </label>
              <label>
                Email *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="example@gmail.com"
                  required
                />
              </label>
              <label>
                Số điện thoại
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="Nhập số điện thoại"
                />
              </label>
              <label>
                Chức vụ
                <input
                  name="position"
                  value={form.position}
                  onChange={updateField}
                  placeholder="Ví dụ: Nhân viên"
                />
              </label>
              <label>
                Phòng ban
                <input
                  name="department"
                  value={form.department}
                  onChange={updateField}
                  placeholder="Ví dụ: IT"
                />
              </label>
              <label>
                Lương (VNĐ)
                <input
                  type="number"
                  min="0"
                  name="salary"
                  value={form.salary}
                  onChange={updateField}
                  placeholder="12000000"
                />
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? 'Đang lưu...'
                  : editingId
                    ? 'Lưu cập nhật'
                    : 'Thêm nhân viên'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setForm(emptyForm)}
              >
                Xóa nội dung
              </button>
            </div>
          </form>
        </section>
      )}

      {viewEmployee && (
        <section className="panel detail-panel">
          <div className="section-heading">
            <h2>Thông tin nhân viên</h2>
            <button
              className="secondary"
              onClick={() => setViewEmployee(null)}
            >
              Đóng
            </button>
          </div>
          <div className="detail-grid">
            {[
              ['Mã nhân viên', viewEmployee.employeeId],
              ['Họ và tên', viewEmployee.fullName],
              ['Email', viewEmployee.email],
              ['Số điện thoại', viewEmployee.phone],
              ['Chức vụ', viewEmployee.position],
              ['Phòng ban', viewEmployee.department],
              ['Lương', formatSalary(viewEmployee.salary)],
            ].map(([label, value]) => (
              <div className="detail-item" key={label}>
                <span>{label}</span>
                <strong>{value || 'Chưa cập nhật'}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="section-heading list-heading">
          <div>
            <p className="eyebrow">DỮ LIỆU HỆ THỐNG</p>
            <h2>Danh sách nhân viên</h2>
            <p className="subheading">
              Tra cứu và quản lý thông tin nhân sự của bạn.
            </p>
          </div>
          <button onClick={openAddForm}>+ Thêm nhân viên</button>
        </div>

        <div className="toolbar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadEmployees()}
            placeholder="Tìm theo tên, email hoặc mã nhân viên..."
            aria-label="Tìm kiếm nhân viên"
          />
          <button onClick={() => loadEmployees()}>Tìm kiếm</button>
          <button className="secondary" onClick={resetList}>
            Làm mới
          </button>
        </div>

        {loading && <p className="loading">Đang tải dữ liệu nhân viên...</p>}

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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!loading && employees.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty">
                    {error ? 'Không tải được dữ liệu.' : 'Chưa có nhân viên.'}
                  </td>
                </tr>
              )}
              {employees.map((employee) => (
                <tr key={employee._id || employee.employeeId}>
                  <td><span className="employee-code">{employee.employeeId}</span></td>
                  <td className="employee-name">{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || '—'}</td>
                  <td>{employee.position || '—'}</td>
                  <td>{employee.department || '—'}</td>
                  <td>{formatSalary(employee.salary)}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="small-button view-button"
                        onClick={() => setViewEmployee(employee)}
                      >
                        Xem
                      </button>
                      <button
                        className="small-button edit-button"
                        onClick={() => openEditForm(employee)}
                      >
                        Sửa
                      </button>
                      <button
                        className="small-button delete-button"
                        onClick={() => deleteEmployee(employee)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            {loading ? 'Đang cập nhật...' : `Hiển thị ${employees.length} nhân viên`}
          </span>
          <strong>Tổng số nhân viên: {employees.length}</strong>
        </div>
      </section>

      <footer className="footer">
        Hệ thống quản lý nhân sự · Dương Thị Tâm Nghi · MSSV 237923
      </footer>
    </main>
  )
}

export default App
