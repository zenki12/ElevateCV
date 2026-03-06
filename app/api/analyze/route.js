import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const ANALYSIS_PROMPT = `Bạn là chuyên gia tư vấn nghề nghiệp hàng đầu Việt Nam với hơn 15 năm kinh nghiệm review CV. 
Phân tích CV dưới đây so với mô tả công việc (JD) và trả về kết quả phân tích dưới dạng JSON.

CV:
---
{CV_TEXT}
---

Mô tả công việc (JD):
---
{JD_TEXT}
---

Trả về JSON với cấu trúc CHÍNH XÁC sau (không thêm markdown, không thêm code block, chỉ JSON thuần):
{
  "candidateName": "Tên ứng viên (lấy từ CV)",
  "overallScore": <số từ 0-100>,
  "recommendation": "NÊN ỨNG TUYỂN" | "CẦN CÂN NHẮC" | "KHÔNG NÊN",
  "recommendationDetail": "Giải thích chi tiết lý do khuyến nghị, 2-3 câu",
  "cvStrategy": {
    "summary": "Đoạn nhận xét tổng quan chiến lược CV, 3-4 câu chi tiết",
    "shouldDo": "Gợi ý cụ thể nên làm, 2-3 câu",
    "shouldNotDo": "Gợi ý cụ thể không nên làm, 2-3 câu"
  },
  "metrics": [
    {"name": "Mức độ phù hợp", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Hiệu quả tóm tắt", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Kinh nghiệm", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Kỹ năng kỹ thuật", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Học vấn", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Từ khóa ATS", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Thành tích", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Kỹ năng mềm", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Ngôn ngữ", "score": <0-100>, "comment": "nhận xét ngắn"},
    {"name": "Tổng thể", "score": <0-100>, "comment": "nhận xét ngắn"}
  ],
  "layout": {
    "score": <0-100>,
    "summary": "Nhận xét về bố cục và trình bày, 2-3 câu",
    "tips": [
      "Gợi ý cải thiện bố cục 1",
      "Gợi ý cải thiện bố cục 2",
      "Gợi ý cải thiện bố cục 3"
    ]
  },
  "deepAnalysis": [
    {
      "sectionName": "KINH NGHIỆM LÀM VIỆC",
      "sectionIcon": "💼",
      "subtitle": "(Tên vị trí cụ thể)",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Mô tả vấn đề phát hiện được trong phần này của CV, 2-3 câu chi tiết",
      "coachAdvice": "Lời khuyên coach chuyên nghiệp dạng trích dẫn, 1-2 câu",
      "actionSteps": ["Bước hành động 1", "Bước hành động 2", "Bước hành động 3"],
      "rewriteSample": {
        "currentText": "Trích dẫn nguyên văn từ CV hiện tại cần cải thiện",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Bản viết lại chuyên sâu, chi tiết và ấn tượng hơn nhiều",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Lời khuyên chuyên gia ngắn gọn về cách cải thiện phần này"
      }
    },
    {
      "sectionName": "KỸ NĂNG (CÔNG NGHỆ)",
      "sectionIcon": "⚡",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện trong phần kỹ năng",
      "coachAdvice": "Lời khuyên coach",
      "actionSteps": ["Bước 1", "Bước 2", "Bước 3"],
      "rewriteSample": {
        "currentText": "Kỹ năng hiện tại liệt kê trong CV",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Cách trình bày kỹ năng tốt hơn",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip chuyên gia"
      }
    },
    {
      "sectionName": "TÓM TẮT GIỚI THIỆU",
      "sectionIcon": "📝",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện trong phần tóm tắt",
      "coachAdvice": "Lời khuyên",
      "actionSteps": ["Bước 1", "Bước 2"],
      "rewriteSample": {
        "currentText": "Tóm tắt hiện tại",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Tóm tắt cải thiện",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip"
      }
    },
    {
      "sectionName": "HÀNH CHÍNH & QUẢN LÝ",
      "sectionIcon": "📋",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện",
      "coachAdvice": "Lời khuyên",
      "actionSteps": ["Bước 1", "Bước 2"],
      "rewriteSample": {
        "currentText": "Nội dung hiện tại",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Nội dung cải thiện",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip"
      }
    },
    {
      "sectionName": "GIAO TIẾP & KẾT NỐI",
      "sectionIcon": "🤝",
      "subtitle": "",
      "score": <0-100>,
      "status": "ƯU TIÊN: RẤT CAO" (< 30) | "ƯU TIÊN: CAO" (31-49) | "ƯU TIÊN: TRUNG BÌNH" (50-79) | "TỐT" (80-89) | "RẤT TỐT" (90-100),
      "statusColor": "red" (< 50) | "yellow" (50-79) | "green" (>= 80),
      "issueDetection": "Vấn đề phát hiện",
      "coachAdvice": "Lời khuyên",
      "actionSteps": ["Bước 1", "Bước 2"],
      "rewriteSample": {
        "currentText": "Nội dung hiện tại",
        "currentLabel": "HIỆN TẠI",
        "improvedText": "Nội dung cải thiện",
        "improvedLabel": "GỢI Ý CẢI THIỆN",
        "expertTip": "Tip"
      }
    }
  ]
}

LƯU Ý QUAN TRỌNG:
- deepAnalysis phải có TỐI THIỂU 5 phần phân tích chuyên sâu
- Mỗi phần phải có đầy đủ: issueDetection, coachAdvice, actionSteps, rewriteSample
- rewriteSample.improvedText phải là bản viết lại CHI TIẾT và CHUYÊN NGHIỆP, dài hơn bản gốc
- Hãy phân tích dựa trên CV và JD thực tế được cung cấp
- Tất cả nội dung phải bằng tiếng Việt`;

async function extractTextFromPDF(buffer) {
    try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return data.text;
    } catch (err) {
        console.error('PDF parse error:', err);
        return '';
    }
}

async function extractTextFromDOCX(buffer) {
    try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (err) {
        console.error('DOCX parse error:', err);
        return '';
    }
}

function getMockResult() {
    return {
        candidateName: "Nguyễn Xuân Thái",
        overallScore: 68,
        recommendation: "CẦN CÂN NHẮC",
        recommendationDetail: "Dù kỹ năng phân tích và báo cáo rất xuất sắc, ứng viên là hạn chế không khớp tiêu chí ứng tuyển của JD và hướng phát triển là Quản lý Sales/Chiến lược hơn là Admin/Support. Nếu doanh nghiệp cởi mở về giới hạn và cần một Trợ lý thiên về 'Chief of Staff' (Tham mưu) hơn là Thư ký, đây là ứng viên tiềm năng.",
        cvStrategy: {
            summary: "Ứng viên Nông Xuân Thái sở hữu nền tảng mạnh mẽ về Vận hành Kinh doanh (Sales Operations) và tư duy phân tích dữ liệu, rất phù hợp với 45% trong số công việc (Điều phối tiến độ) & Tham mưu chiến lược. Tuy nhiên, cần lưu ý nhất là thiếu chỉ cùng về Giới hạn JD yêu cầu Nữ và sự thiếu hụt kinh nghiệm chuyên sâu về hành chính/thủ tục/kế toán (Quản lý chi, hậu cần), sẽ cần chiếm 25% công việc.",
            shouldDo: "Đặt vị trí bản thân từ 'Quản lý Sales' sang 'Trợ lý Kinh doanh Chiến lược'. Nhấn mạnh khả năng 'Tham mưu & Phân tích' để bổ sung cho phần Hành chính.",
            shouldNotDo: "Nếu được phỏng vấn, cần chuẩn bị trình chuyển đổi số, thuyết phục nhà tuyển dụng thay vì tiếp tục làm quản lý Sales. Nhấn mạnh kỹ năng 'Quản lý kinh doanh' nhiều hơn là 'Trợ lý điều hành' toàn diện."
        },
        metrics: [
            { name: "Mức độ phù hợp", score: 61, comment: "Kiến thức gặp hành chính tuyển dụng hơn chưa đủ rõ." },
            { name: "Hiệu quả tóm tắt", score: 74, comment: "Mặc dù, sẽ ổn nhưng cần thêm câu kết dẫn dắt tốt hơn." },
            { name: "Kinh nghiệm", score: 72, comment: "3 năm kinh nghiệm phù hợp, cần highlight rõ hơn." },
            { name: "Kỹ năng kỹ thuật", score: 65, comment: "Có kỹ năng Excel, cần thêm công cụ quản lý." },
            { name: "Học vấn", score: 70, comment: "Bằng cử nhân phù hợp với vị trí." },
            { name: "Từ khóa ATS", score: 55, comment: "Thiếu nhiều từ khóa quan trọng từ JD." },
            { name: "Thành tích", score: 78, comment: "Có số liệu cụ thể, rất tốt." },
            { name: "Kỹ năng mềm", score: 80, comment: "Thể hiện tốt khả năng giao tiếp và làm việc nhóm." },
            { name: "Ngôn ngữ", score: 60, comment: "Cần cải thiện trình độ tiếng Anh." },
            { name: "Tổng thể", score: 68, comment: "CV khá tốt nhưng cần tùy chỉnh cho vị trí cụ thể." }
        ],
        layout: {
            score: 85,
            summary: "Tổ chức rõ ràng, sạch sẽ, phân chia cột rõ ràng. Tuy nhiên, định dạng 2 cột có thể gây khó khăn cho một số hệ thống ATS trong việc quét thông tin tự động. Nhìn chung, cần cải thiện bố cục để tối ưu.",
            tips: [
                "Nên chuyển sang bố cục 1 cột (single column) để tối ưu hóa cho hệ thống ATS.",
                "Phải đảm bảo là các đầu bullet point được chuẩn hóa đồng nhất.",
                "Cải bổ sung thêm khoảng cách giữa Tiêu đề và Bullet Point để tăng tính dễ đọc.",
                "Cân nhắc sử dụng font từ tệp Google Fonts, Calibri hoặc Garamond để tăng trải nghiệm đọc chia."
            ]
        },
        deepAnalysis: [
            {
                sectionName: "KINH NGHIỆM LÀM VIỆC",
                sectionIcon: "💼",
                subtitle: "(TRỢ LÝ ĐIỀU HÀNH)",
                score: 70,
                status: "ƯU TIÊN: TRUNG BÌNH",
                statusColor: "yellow",
                issueDetection: "Mô tả công việc hiện tại quá tập trung vào Sales Ops, thiếu phù hợp với vị trí Trợ lý CEO. Cần rewrite để highlight kỹ năng điều phối và hỗ trợ quản lý cấp cao.",
                coachAdvice: "\"Nếu bạn các quản dẫn được này gì ngoài tốp và trí thức, viết thực thì\" và \"Bổ sung bổ cáu thay gọi viết\" \"Theo dấu chỉ chi\".",
                actionSteps: [
                    "Thay đổi cùng là sử dụng 'Vận hành, Quản phối, Tài quản'.",
                    "Từ lu điểm hóa cũng cần chìa.",
                    "Chứng minh bán cùng chuyển đổi số."
                ],
                rewriteSample: {
                    currentText: "Mô tả công việc hiện tại quá tập trung vào Sales Ops, thiếu phù hợp với vị trí Trợ lý CEO.",
                    currentLabel: "HIỆN TẠI",
                    improvedText: "Điều phối tiến độ và kiểm soát thực thi các chỉ số KPI trong việc Doanh thu, tỷ lệ chuyển đổi từ bộ phận kinh doanh, đảm bảo theo sát mục tiêu tuyến cam đoan lãnh đạo và đứng lên gọi Ban Giám đốc.",
                    improvedLabel: "GỢI Ý CẢI THIỆN",
                    expertTip: "Instant HR coach: Kiếm tra bộ viết với cả 'Sử dụng thuận mẫu mạng sang, bắt Lĩnh vực/Kết quả' thay vì chỉ liệt kê nhiệm vụ."
                }
            },
            {
                sectionName: "KỸ NĂNG (CÔNG NGHỆ)",
                sectionIcon: "⚡",
                subtitle: "",
                score: 65,
                status: "ƯU TIÊN: TRUNG BÌNH",
                statusColor: "yellow",
                issueDetection: "Thiếu hàm các công ty quản lý công việc mà JD yêu cầu trợ lý CEO bảo gồm Earth, Notion, Google Workspace. Chỉ có kỹ năng Excel nhưng thiếu thể hiện mức độ thành thạo.",
                coachAdvice: "\"Trình dành nhiều 'Công cụ & Phần mềm' thành được một nhóm để cùng lên quy trình độ sâu.\"",
                actionSteps: [
                    "Thêm: Loom Suite, Asana, Google Workspace, CRM.",
                    "Chứng minh bán cùng chuyển đổi số."
                ],
                rewriteSample: {
                    currentText: "Excel, PowerPoint, Sales...",
                    currentLabel: "HIỆN TẠI",
                    improvedText: "Thành thạo công ty quản lý vận hành & Chuyên đổi số: Loom Suite, Notion, Google Workspace, CRM Systems và các ứng dụng AI hỗ trợ phân tích dữ liệu.",
                    improvedLabel: "GỢI Ý CẢI THIỆN",
                    expertTip: "Instant HR coach: Không chỉ liệt kê, cần Sử dụng khuôn mẫu mạng sang, bắt 'Lĩnh vực ngành/kết quả đã thành đông' để minh chứng."
                }
            },
            {
                sectionName: "TÓM TẮT GIỚI THIỆU",
                sectionIcon: "📝",
                subtitle: "",
                score: 55,
                status: "ƯU TIÊN: TRUNG BÌNH",
                statusColor: "yellow",
                issueDetection: "Mục tiêu nghề nghiệp nêu chung chung chưa có rõ ràng với vị trí Trợ lý điều hành, hướng Tring Jr CEO. Thiếu sự liên kết rõ ràng với JD.",
                coachAdvice: "\"Viết dần khi mô tả, đẻ chi tiêu bàn trung tuyền muốn xem biến mà đạt tàn phú thật dần trở hướng tuyển.\"",
                actionSteps: [
                    "Đổ vào nhiều mức tiến độ và khẩn vật 'Trả cùng cần với dần cải'.",
                    "Tăng trọng văn Trợ lý điều hành và 'TS và cấp tiêu.'"
                ],
                rewriteSample: {
                    currentText: "Chuyên viên hỗ trợ điều hành với 3 năm kinh nghiệm vận hành kinh doanh của Tring Jr điều hành Trợ lý CEO.",
                    currentLabel: "HIỆN TẠI",
                    improvedText: "Chuyên viên Vận hành & Phân tích với 3 năm kinh nghiệm được đóng vai trò Trợ lý Kinh doanh Chiến lược 2024 cùng trình, đảm bảo quá trình nâng cấp cho CEO trong quản lý vận hành, năng đổi phân tích và với cải thiện quy trình lên xuống lẻ kết bảo hành.",
                    improvedLabel: "GỢI Ý CẢI THIỆN",
                    expertTip: "Đừng viết 'Tring Jr điều hành'. Thì cải cùng tiêu."
                }
            },
            {
                sectionName: "KINH NGHIỆM (PHẦN BÁO CÁO)",
                sectionIcon: "📊",
                subtitle: "",
                score: 70,
                status: "ƯU TIÊN: TRUNG BÌNH",
                statusColor: "yellow",
                issueDetection: "Bổ sử y tế bán cùng trung cùng chìa lưu tính Tham mưu và Phân tích cần có lì.",
                coachAdvice: "\"Nâng chuẩn minh sử dựa người bán cần chuẩn tra và bổ trợ và nửa cùng dần.\"",
                actionSteps: [
                    "Từ bán ra nhiều: 'Tham mưu', 'Cấm cùng bàn', 'Chìm tuyển'.",
                    "Bổ tích nửa và trên khuấy."
                ],
                rewriteSample: {
                    currentText: "Tổng hợp tự tìn dữ liệu nguyên (kịnh doanh), nhập sử để chuyên mưu bổ gốc và va đổ mưa giải phân biến giải kinh nghiệm trong cấm hành.",
                    currentLabel: "HIỆN TẠI",
                    improvedText: "Tổng hợp tự tin dữ liệu nguyên (Kinh doanh, Nhập sử để chuyên mưu bốc gốc, chứng nhận sử đổ, đứng nhận đáo và va đổ mưa giải phân biến giải kinh nghiệm trong cấm hành.",
                    improvedLabel: "GỢI Ý CẢI THIỆN",
                    expertTip: "Instant HR coach: Lẻ ly nốt trong bộ 'Tiếng ngay...đổi lẻ bản nguyên\"'. 'Thay cùng giải khuyn ngoài sử.'"
                }
            },
            {
                sectionName: "HÀNH CHÍNH & QUẢN LÝ",
                sectionIcon: "📋",
                subtitle: "",
                score: 40,
                status: "ƯU TIÊN: CAO",
                statusColor: "red",
                issueDetection: "Thiếu kỹ năng bổ chính xuất tuyện sử dẻ hỗ tiêu.",
                coachAdvice: "\"Viết bán cùng nguyên sử, đẻ dần lẻ bàn cùng trung quan đổi sử nhập trình bán cùng dầu, chính bố, đứng lên sử đổi bản khuyn quản đổi\".",
                actionSteps: [
                    "Tải chín cùng đổ trình xuất trải thải sử dẻ hỗ tiêu",
                    "Lẻ bổ dần bàn sử tạo dần tiến dẫn"
                ],
                rewriteSample: {
                    currentText: "Tổ chính cùng đổ chưa sử cùng bắn quả chìa lên cùng hành chính. Chuẩn lẻ lên các mưa treo DOCX của chìa bổ lại. Đẻ chìa hỗ đổ bản vật trại sử được trión.",
                    currentLabel: "HIỆN TẠI",
                    improvedText: "Tổ chín cùng đổ phải sử cùng bắn quả chìa lên hành chính, đảm bảo hiệu quả sử được tốt.",
                    improvedLabel: "GỢI Ý CẢI THIỆN",
                    expertTip: "Instant HR coach: Bổ cùng lẻ hỗ trọng, Chuẩn bổ lẻ bổ chìa. 'Thực đổ thuận bổn khuyn sử được tốt bổ dần cùng.'"
                }
            },
            {
                sectionName: "GIAO TIẾP & KẾT NỐI",
                sectionIcon: "🤝",
                subtitle: "",
                score: 80,
                status: "TỐT",
                statusColor: "green",
                issueDetection: "Mô bổ tảng giao cùng bổ bàn 'Cẩn sử hỗy Tuyển đẻn sử dần cải.'",
                coachAdvice: "\"Kiến mưu nguyên: 'Phải bổ cùng phường bàn', 'Nhưng .Cẩn sử bổ gốc.'\"",
                actionSteps: [
                    "Bổ sử bổ tiến sốt cùng bổ gốc truing cùng đổ.",
                    "Tuyển đẻn sử bổ cùng bổ phòng bàn (HR, Finance, IT) và đổi đổi đẻn bổ đổ hỗ tếc cùng đẻn bàn cùng chia sẻ trải sử tiêu kiến, dằng phải tiêu."
                ],
                rewriteSample: {
                    currentText: "Biết giao cùng bổ sử bổ gốc 'Cẩn sử hỗy' bổ 'Tuyển đẻn sử đổi.'",
                    currentLabel: "HIỆN TẠI",
                    improvedText: "Biết gia sử bổ cùng bàn đổi sử bổ gốc Tuyển đẻn sử đổ cùng quản lý về bổ phòng bàn (HR, Finance, IT) và đổ đổi đẻn bổ đổ hỗ tếc cùng bàn chính sử bổ không kiến sử, dằng phải tiêu đẻk.",
                    improvedLabel: "GỢI Ý CẢI THIỆN",
                    expertTip: "Instant HR coach: Sử bổ cùng lẻ Trình 'Cẩn sử'. 'Thải bổ sử cùng bàn.'"
                }
            }
        ]
    };
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const cvFile = formData.get('cv');
        const jdText = formData.get('jd');

        if (!cvFile || !jdText) {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp đầy đủ CV và mô tả công việc.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const fileName = cvFile.name.toLowerCase();

        let cvText = '';
        if (fileName.endsWith('.pdf')) {
            cvText = await extractTextFromPDF(buffer);
        } else if (fileName.endsWith('.docx')) {
            cvText = await extractTextFromDOCX(buffer);
        } else {
            return NextResponse.json(
                { error: 'Định dạng file không được hỗ trợ. Vui lòng sử dụng PDF hoặc DOCX.' },
                { status: 400 }
            );
        }

        if (!cvText.trim()) {
            cvText = `[Không thể trích xuất text từ file: ${cvFile.name}]`;
        }

        if (!genAI) {
            console.log('No GEMINI_API_KEY found, returning mock data');
            return NextResponse.json(getMockResult());
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = ANALYSIS_PROMPT
            .replace('{CV_TEXT}', cvText.substring(0, 8000))
            .replace('{JD_TEXT}', jdText.substring(0, 4000));

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const analysisResult = JSON.parse(cleanJson);
        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error('Analysis error:', error);
        console.log('Falling back to mock data due to error');
        return NextResponse.json(getMockResult());
    }
}
