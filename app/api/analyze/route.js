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
  "experiences": [
    {
      "title": "Tên vị trí/công ty",
      "score": <0-100>,
      "feedback": "Nhận xét chi tiết về kinh nghiệm này, 2-3 câu",
      "suggestion": "Gợi ý viết lại mô tả chi tiết hơn",
      "keywords": ["từ khóa 1", "từ khóa 2"]
    }
  ],
  "optimizations": [
    {
      "section": "Tên phần cần tối ưu",
      "current": "Nội dung hiện tại (trích dẫn ngắn từ CV)",
      "improved": "Nội dung gợi ý cải thiện"
    }
  ]
}`;

async function extractTextFromPDF(buffer) {
    try {
        // Use pdf-parse with require() for better Vercel compatibility
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
        recommendationDetail: "Dù kỹ năng phân tích và báo cáo rất xuất sắc, ứng viên là hạn chế không khớp tiêu chí ứng tuyển của JD và hướng phát triển là Quản lý Sales/Chiến lược hơn là Admin/Support.",
        cvStrategy: {
            summary: "Ứng viên Nông Xuân Thái sở hữu nền tảng mạnh mẽ về Vận hành Kinh doanh (Sales Operations) và tư duy phân tích dữ liệu, rất phù hợp với 45% trong số công việc (Điều phối tiến độ) & Tham mưu chiến lược. Tuy nhiên, cần lưu ý là thiếu kinh nghiệm chuyển sâu về hành chính/thủ tục/kế toán.",
            shouldDo: "Đặt vị trí bản thân từ 'Quản lý Sales' sang 'Trợ lý Kinh doanh Chiến lược'. Nhấn mạnh khả năng 'Tham mưu & Phân tích' để bổ sung cho phần Hành chính.",
            shouldNotDo: "Nếu được phỏng vấn, cần chuẩn bị trình bày về chuyển đổi số, đo đạt thuyết phục nhà tuyển dụng thay vì tập trung vào kinh nghiệm Sales thuần."
        },
        metrics: [
            { name: "Mức độ phù hợp", score: 61, comment: "Kiến thức hành chính tuyển dụng chưa đủ rõ." },
            { name: "Hiệu quả tóm tắt", score: 74, comment: "Ổn nhưng cần thêm câu kết dẫn dắt tốt hơn." },
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
            summary: "Tổ chức rõ ràng, sạch sẽ, phân chia cột rõ ràng. Tuy nhiên, định dạng 2 cột có thể gây khó khăn với hệ thống ATS trong việc quét thông tin.",
            tips: [
                "Nên chuyển sang bố cục 1 cột (single column) để tối ưu hóa cho hệ thống ATS.",
                "Phải đảm bảo là các đầu bullet point được chuẩn hóa đồng nhất.",
                "Cải bổ sung thêm khoảng cách giữa Tiêu đề và Bullet Point để tăng tính dễ đọc."
            ]
        },
        experiences: [
            {
                title: "Phát Triển Viên Sẻ (Trợ lý điều hành)",
                score: 70,
                feedback: "Mô tả công việc hiện tại quá tập trung vào Sales Ops, chưa phù hợp với vị trí Trợ lý CEO. Cần rewrite để highlight kỹ năng điều phối và hỗ trợ quản lý.",
                suggestion: "Điều phối tiến độ và kiểm soát thực thi các chỉ số KPI trong việc Doanh thu, tỷ lệ chuyển đổi từ bộ phận kinh doanh, đảm bảo theo sát mục tiêu tuyến cam đoan lãnh đạo.",
                keywords: ["Sales Operations", "KPI", "Điều phối"]
            }
        ],
        optimizations: [
            {
                section: "Tóm tắt bản thân",
                current: "Quản lý vận hành kinh doanh với 3 năm kinh nghiệm...",
                improved: "Chuyên viên hỗ trợ điều hành với 3 năm kinh nghiệm vận hành kinh doanh, chuyên sâu phân tích dữ liệu và tối ưu quy trình. Thành thạo Excel, công cụ quản lý dự án và báo cáo chiến lược."
            },
            {
                section: "Kỹ năng",
                current: "Excel, PowerPoint, Sales...",
                improved: "Quản lý lịch trình & điều phối | Phân tích dữ liệu & báo cáo (Excel nâng cao) | Hỗ trợ ra quyết định chiến lược | Giao tiếp đa phòng ban | Quản lý dự án (Notion/Trello)"
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

        // Convert file to buffer
        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const fileName = cvFile.name.toLowerCase();

        // Extract text from file
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
            // If we can't extract text, still allow analysis with filename info
            cvText = `[Không thể trích xuất text từ file: ${cvFile.name}]`;
        }

        // If no Gemini API key, return mock data
        if (!genAI) {
            console.log('No GEMINI_API_KEY found, returning mock data');
            return NextResponse.json(getMockResult());
        }

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = ANALYSIS_PROMPT
            .replace('{CV_TEXT}', cvText.substring(0, 8000))
            .replace('{JD_TEXT}', jdText.substring(0, 4000));

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON response - handle potential markdown code blocks
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const analysisResult = JSON.parse(cleanJson);
        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error('Analysis error:', error);

        // Fallback to mock data on error
        console.log('Falling back to mock data due to error');
        return NextResponse.json(getMockResult());
    }
}
