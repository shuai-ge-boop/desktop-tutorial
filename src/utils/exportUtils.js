import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

/**
 * 导出Excel文件
 * @param {Array} data - 要导出的数据
 * @param {String} filename - 文件名
 * @param {Object} options - 导出选项
 */
export const exportToExcel = (data, filename = '用户数据', options = {}) => {
	try {
		// 处理数据，转换为Excel格式
		const processedData = data.map(item => ({
			'ID': item.id,
			'用户名': item.username,
			'姓名': item.name,
			'邮箱': item.email,
			'手机号': item.phone || '',
			'角色': getRoleText(item.role),
			'状态': item.status === 'active' ? '正常' : '禁用',
			'部门': getDepartmentText(item.department),
			'创建时间': item.createTime,
			'备注': item.remark || ''
		}))

		// 创建工作簿
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(processedData)

		// 设置列宽
		const colWidths = [
			{ wch: 8 },   // ID
			{ wch: 15 },  // 用户名
			{ wch: 12 },  // 姓名
			{ wch: 25 },  // 邮箱
			{ wch: 15 },  // 手机号
			{ wch: 10 },  // 角色
			{ wch: 8 },   // 状态
			{ wch: 12 },  // 部门
			{ wch: 20 },  // 创建时间
			{ wch: 30 }   // 备注
		]
		ws['!cols'] = colWidths

		// 添加工作表
		XLSX.utils.book_append_sheet(wb, ws, '用户数据')

		// 生成文件并下载
		const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
		const blob = new Blob([wbout], { type: 'application/octet-stream' })
		saveAs(blob, `${filename}.xlsx`)

		return { success: true, message: 'Excel导出成功' }
	} catch (error) {
		console.error('Excel导出失败:', error)
		return { success: false, message: 'Excel导出失败' }
	}
}

/**
 * 导出CSV文件
 * @param {Array} data - 要导出的数据
 * @param {String} filename - 文件名
 */
export const exportToCSV = (data, filename = '用户数据') => {
	try {
		// 处理数据
		const processedData = data.map(item => ({
			'ID': item.id,
			'用户名': item.username,
			'姓名': item.name,
			'邮箱': item.email,
			'手机号': item.phone || '',
			'角色': getRoleText(item.role),
			'状态': item.status === 'active' ? '正常' : '禁用',
			'部门': getDepartmentText(item.department),
			'创建时间': item.createTime,
			'备注': item.remark || ''
		}))

		// 创建工作表
		const ws = XLSX.utils.json_to_sheet(processedData)

		// 转换为CSV
		const csv = XLSX.utils.sheet_to_csv(ws)

		// 添加BOM以支持中文
		const csvWithBOM = '\uFEFF' + csv

		// 创建Blob并下载
		const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' })
		saveAs(blob, `${filename}.csv`)

		return { success: true, message: 'CSV导出成功' }
	} catch (error) {
		console.error('CSV导出失败:', error)
		return { success: false, message: 'CSV导出失败' }
	}
}

/**
 * 导出PDF文件
 * @param {Array} data - 要导出的数据
 * @param {String} filename - 文件名
 */
export const exportToPDF = (data, filename = '用户数据') => {
	try {
		// 创建PDF文档
		const doc = new jsPDF()

		// 设置中文字体（需要额外配置）
		doc.setFont('helvetica')

		// 添加标题
		doc.setFontSize(16)
		doc.text('User Data Report', 20, 20)

		// 准备表格数据
		const tableHeaders = ['ID', 'Username', 'Name', 'Email', 'Role', 'Status', 'Create Time']
		const tableData = data.map(item => [
			item.id,
			item.username,
			item.name,
			item.email,
			getRoleText(item.role),
			item.status === 'active' ? 'Active' : 'Disabled',
			item.createTime
		])

		// 添加表格
		doc.autoTable({
			head: [tableHeaders],
			body: tableData,
			startY: 30,
			styles: {
				fontSize: 8,
				cellPadding: 2
			},
			headStyles: {
				fillColor: [64, 158, 255],
				textColor: [255, 255, 255]
			}
		})

		// 保存PDF
		doc.save(`${filename}.pdf`)

		return { success: true, message: 'PDF导出成功' }
	} catch (error) {
		console.error('PDF导出失败:', error)
		return { success: false, message: 'PDF导出失败' }
	}
}

/**
 * 生成导入模板
 * @param {String} filename - 文件名
 */
export const generateImportTemplate = (filename = '用户导入模板') => {
	try {
		// 模板数据
		const templateData = [
			{
				'用户名': 'user001',
				'姓名': '张三',
				'邮箱': 'zhangsan@example.com',
				'手机号': '13800138000',
				'角色': '普通用户',
				'状态': '正常',
				'部门': '技术部',
				'备注': '示例用户'
			}
		]

		// 创建工作簿
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(templateData)

		// 设置列宽
		const colWidths = [
			{ wch: 15 },  // 用户名
			{ wch: 12 },  // 姓名
			{ wch: 25 },  // 邮箱
			{ wch: 15 },  // 手机号
			{ wch: 10 },  // 角色
			{ wch: 8 },   // 状态
			{ wch: 12 },  // 部门
			{ wch: 30 }   // 备注
		]
		ws['!cols'] = colWidths

		// 添加说明工作表
		const instructionData = [
			{ '字段': '用户名', '说明': '必填，3-20个字符，只能包含字母、数字和下划线', '示例': 'user001' },
			{ '字段': '姓名', '说明': '必填，2-20个字符', '示例': '张三' },
			{ '字段': '邮箱', '说明': '必填，有效的邮箱地址', '示例': 'zhangsan@example.com' },
			{ '字段': '手机号', '说明': '选填，11位手机号码', '示例': '13800138000' },
			{ '字段': '角色', '说明': '必填，可选值：管理员、版主、普通用户', '示例': '普通用户' },
			{ '字段': '状态', '说明': '必填，可选值：正常、禁用', '示例': '正常' },
			{ '字段': '部门', '说明': '选填，可选值：技术部、产品部、运营部、市场部、人事部', '示例': '技术部' },
			{ '字段': '备注', '说明': '选填，最多200个字符', '示例': '示例用户' }
		]
		const instructionWs = XLSX.utils.json_to_sheet(instructionData)
		instructionWs['!cols'] = [{ wch: 10 }, { wch: 40 }, { wch: 20 }]

		// 添加工作表
		XLSX.utils.book_append_sheet(wb, ws, '用户数据')
		XLSX.utils.book_append_sheet(wb, instructionWs, '导入说明')

		// 生成文件并下载
		const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
		const blob = new Blob([wbout], { type: 'application/octet-stream' })
		saveAs(blob, `${filename}.xlsx`)

		return { success: true, message: '模板下载成功' }
	} catch (error) {
		console.error('模板生成失败:', error)
		return { success: false, message: '模板生成失败' }
	}
}

/**
 * 解析导入文件
 * @param {File} file - 上传的文件
 * @returns {Promise} 解析结果
 */
export const parseImportFile = (file) => {
	return new Promise((resolve, reject) => {
		try {
			const reader = new FileReader()

			reader.onload = (e) => {
				try {
					const data = new Uint8Array(e.target.result)
					const workbook = XLSX.read(data, { type: 'array' })

					// 读取第一个工作表
					const firstSheetName = workbook.SheetNames[0]
					const worksheet = workbook.Sheets[firstSheetName]

					// 转换为JSON
					const jsonData = XLSX.utils.sheet_to_json(worksheet)

					// 验证和转换数据
					const processedData = jsonData.map((row, index) => {
						const errors = []

						// 验证必填字段
						if (!row['用户名']) errors.push('用户名不能为空')
						if (!row['姓名']) errors.push('姓名不能为空')
						if (!row['邮箱']) errors.push('邮箱不能为空')
						if (!row['角色']) errors.push('角色不能为空')
						if (!row['状态']) errors.push('状态不能为空')

						// 验证格式
						if (row['邮箱'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row['邮箱'])) {
							errors.push('邮箱格式不正确')
						}

						if (row['手机号'] && !/^1[3-9]\d{9}$/.test(row['手机号'])) {
							errors.push('手机号格式不正确')
						}

						return {
							rowIndex: index + 2, // Excel行号（从2开始，因为第1行是标题）
							username: row['用户名'],
							name: row['姓名'],
							email: row['邮箱'],
							phone: row['手机号'] || '',
							role: convertRoleValue(row['角色']),
							status: row['状态'] === '正常' ? 'active' : 'disabled',
							department: convertDepartmentValue(row['部门']),
							remark: row['备注'] || '',
							errors
						}
					})

					resolve({
						success: true,
						data: processedData,
						total: processedData.length,
						validCount: processedData.filter(item => item.errors.length === 0).length,
						errorCount: processedData.filter(item => item.errors.length > 0).length
					})
				} catch (error) {
					reject({ success: false, message: '文件解析失败' })
				}
			}

			reader.onerror = () => {
				reject({ success: false, message: '文件读取失败' })
			}

			reader.readAsArrayBuffer(file)
		} catch (error) {
			reject({ success: false, message: '文件处理失败' })
		}
	})
}

// 辅助函数
const getRoleText = (role) => {
	const roleMap = {
		admin: '管理员',
		moderator: '版主',
		user: '普通用户'
	}
	return roleMap[role] || '未知'
}

const getDepartmentText = (department) => {
	const departmentMap = {
		tech: '技术部',
		product: '产品部',
		operation: '运营部',
		marketing: '市场部',
		hr: '人事部'
	}
	return departmentMap[department] || ''
}

const convertRoleValue = (roleText) => {
	const roleMap = {
		'管理员': 'admin',
		'版主': 'moderator',
		'普通用户': 'user'
	}
	return roleMap[roleText] || 'user'
}

const convertDepartmentValue = (departmentText) => {
	const departmentMap = {
		'技术部': 'tech',
		'产品部': 'product',
		'运营部': 'operation',
		'市场部': 'marketing',
		'人事部': 'hr'
	}
	return departmentMap[departmentText] || ''
}

/**
 * 批量导出（支持大数据量分页导出）
 * @param {Function} fetchDataFn - 获取数据的函数
 * @param {Object} exportOptions - 导出选项
 */
export const batchExport = async (fetchDataFn, exportOptions = {}) => {
	const {
		format = 'excel',
		filename = '用户数据',
		pageSize = 1000,
		onProgress = () => { }
	} = exportOptions

	try {
		let allData = []
		let currentPage = 1
		let hasMore = true
		let totalProcessed = 0

		while (hasMore) {
			const result = await fetchDataFn(currentPage, pageSize)

			if (result.data && result.data.length > 0) {
				allData = allData.concat(result.data)
				totalProcessed += result.data.length

				// 更新进度
				onProgress({
					current: totalProcessed,
					total: result.total || totalProcessed,
					percentage: result.total ? Math.round((totalProcessed / result.total) * 100) : 0
				})

				// 检查是否还有更多数据
				hasMore = result.data.length === pageSize && totalProcessed < (result.total || Infinity)
				currentPage++
			} else {
				hasMore = false
			}
		}

		// 根据格式导出
		let exportResult
		switch (format) {
			case 'csv':
				exportResult = exportToCSV(allData, filename)
				break
			case 'pdf':
				exportResult = exportToPDF(allData, filename)
				break
			default:
				exportResult = exportToExcel(allData, filename)
		}

		return {
			success: true,
			message: `成功导出 ${totalProcessed} 条数据`,
			total: totalProcessed
		}
	} catch (error) {
		console.error('批量导出失败:', error)
		return {
			success: false,
			message: '批量导出失败'
		}
	}
}
