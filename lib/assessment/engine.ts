import { AssessmentDefinition, AssessmentType } from "./data";

type CareerCard = {
  name: string;
  description: string;
  majors: string[];
  skills: string[];
  roadmap: string[];
};

export type AssessmentResult = {
  testId: AssessmentType;
  summary: string;
  code: string;
  highlightTraits: string[];
  careers: CareerCard[];
  majorRecommendations: string[];
  skillsToBuild: string[];
  roadmap3090: string[];
};

export type AnswerMap = Record<string, string>;

type MbtiCode =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ";

type DiscCode = "D" | "I" | "S" | "C";

type MappingValue = {
  summary: string;
  strengths: string[];
  careers: CareerCard[];
};

const mbtiMapping: Partial<Record<MbtiCode, MappingValue>> = {
  INTJ: {
    summary: "Tư duy chiến lược, thích hệ thống và giải quyết vấn đề khó.",
    strengths: ["Phân tích sâu", "Lập kế hoạch", "Tư duy dài hạn"],
    careers: [
      {
        name: "Kỹ sư phần mềm",
        description: "Thiết kế hệ thống và giải bài toán kỹ thuật có cấu trúc.",
        majors: ["Khoa học máy tính", "Kỹ thuật phần mềm"],
        skills: ["Lập trình", "Thiết kế hệ thống", "Giải quyết vấn đề"],
        roadmap: ["30 ngày học nền tảng code", "60 ngày làm dự án mini", "90 ngày tối ưu và review code"],
      },
      {
        name: "Data Analyst",
        description: "Phân tích dữ liệu để đưa ra quyết định dựa trên bằng chứng.",
        majors: ["Khoa học dữ liệu", "Hệ thống thông tin"],
        skills: ["SQL", "Thống kê", "Trực quan hóa dữ liệu"],
        roadmap: ["30 ngày học SQL", "60 ngày làm dashboard", "90 ngày xây portfolio phân tích"],
      },
    ],
  },
  ENFP: {
    summary: "Sáng tạo, linh hoạt và truyền cảm hứng tốt trong môi trường mở.",
    strengths: ["Sáng tạo", "Giao tiếp", "Khởi xướng ý tưởng"],
    careers: [
      {
        name: "Digital Marketing Specialist",
        description: "Xây dựng chiến dịch truyền thông và phát triển thương hiệu.",
        majors: ["Marketing", "Truyền thông đa phương tiện"],
        skills: ["Content", "Phân tích khách hàng", "Quản lý chiến dịch"],
        roadmap: ["30 ngày học nền tảng marketing", "60 ngày chạy thử chiến dịch", "90 ngày đo lường và tối ưu"],
      },
      {
        name: "UX Writer / Content Designer",
        description: "Thiết kế nội dung giúp trải nghiệm số rõ ràng và thuyết phục.",
        majors: ["Truyền thông", "Ngôn ngữ học ứng dụng"],
        skills: ["Viết UX", "Nghiên cứu người dùng", "Tư duy sản phẩm"],
        roadmap: ["30 ngày học UX cơ bản", "60 ngày viết case study", "90 ngày hoàn thiện portfolio"],
      },
    ],
  },
};

const hollandMapping: Record<string, MappingValue> = {
  IAS: {
    summary: "Nghiên cứu - sáng tạo - hỗ trợ con người, phù hợp vai trò định hướng giá trị.",
    strengths: ["Khám phá tri thức", "Tư duy sáng tạo", "Thấu hiểu con người"],
    careers: [
      {
        name: "Chuyên viên tư vấn hướng nghiệp",
        description: "Đánh giá năng lực và thiết kế lộ trình học tập cá nhân.",
        majors: ["Tâm lý học", "Giáo dục học"],
        skills: ["Đặt câu hỏi", "Phân tích hồ sơ", "Coaching"],
        roadmap: ["30 ngày học khung đánh giá", "60 ngày thực hành case", "90 ngày xây quy trình tư vấn"],
      },
      {
        name: "Research Content Strategist",
        description: "Nghiên cứu người dùng để định hướng nội dung giáo dục.",
        majors: ["Truyền thông", "Xã hội học"],
        skills: ["Nghiên cứu", "Thiết kế nội dung", "Đo lường hiệu quả"],
        roadmap: ["30 ngày học research", "60 ngày tạo framework nội dung", "90 ngày triển khai thử nghiệm"],
      },
    ],
  },
  IRC: {
    summary: "Thiên về kỹ thuật, phân tích và độ chính xác cao.",
    strengths: ["Thực hành kỹ thuật", "Tư duy logic", "Chú ý chi tiết"],
    careers: [
      {
        name: "Kỹ sư QA/Testing",
        description: "Đảm bảo chất lượng sản phẩm bằng kiểm thử hệ thống.",
        majors: ["Công nghệ thông tin", "Kỹ thuật máy tính"],
        skills: ["Test case", "Automation", "Phân tích lỗi"],
        roadmap: ["30 ngày học kiểm thử", "60 ngày viết test thực tế", "90 ngày tích hợp CI testing"],
      },
      {
        name: "Kỹ sư cơ điện tử",
        description: "Thiết kế, vận hành hệ thống máy móc tự động.",
        majors: ["Cơ điện tử", "Điện - điện tử"],
        skills: ["CAD", "Điều khiển", "Giải quyết sự cố"],
        roadmap: ["30 ngày học công cụ thiết kế", "60 ngày làm mô hình", "90 ngày tối ưu hệ thống"],
      },
    ],
  },
};

const discMapping: Record<DiscCode, MappingValue> = {
  D: {
    summary: "Quyết đoán, định hướng kết quả và phù hợp vai trò dẫn dắt mục tiêu.",
    strengths: ["Ra quyết định", "Lãnh đạo", "Tập trung mục tiêu"],
    careers: [
      {
        name: "Quản lý dự án trẻ",
        description: "Điều phối tiến độ và nguồn lực để đạt kết quả nhanh.",
        majors: ["Quản trị kinh doanh", "Hệ thống thông tin quản lý"],
        skills: ["Lập kế hoạch", "Quản trị rủi ro", "Điều phối nhóm"],
        roadmap: ["30 ngày học quản lý dự án", "60 ngày làm scrum mini", "90 ngày dẫn dắt dự án nhỏ"],
      },
    ],
  },
  I: {
    summary: "Giao tiếp tốt, tạo ảnh hưởng và lan tỏa động lực trong tập thể.",
    strengths: ["Thuyết trình", "Kết nối", "Truyền cảm hứng"],
    careers: [
      {
        name: "Chuyên viên truyền thông",
        description: "Xây dựng thông điệp và kết nối cộng đồng mục tiêu.",
        majors: ["Quan hệ công chúng", "Marketing"],
        skills: ["Storytelling", "Sự kiện", "Social media"],
        roadmap: ["30 ngày học nền tảng PR", "60 ngày triển khai nội dung", "90 ngày đo lường tương tác"],
      },
    ],
  },
  S: {
    summary: "Ổn định, kiên nhẫn và hỗ trợ đội nhóm bền vững.",
    strengths: ["Hợp tác", "Lắng nghe", "Bền bỉ"],
    careers: [
      {
        name: "Chuyên viên nhân sự",
        description: "Hỗ trợ phát triển con người và văn hóa tổ chức.",
        majors: ["Quản trị nhân lực", "Tâm lý học"],
        skills: ["Phỏng vấn", "Lắng nghe chủ động", "Vận hành quy trình"],
        roadmap: ["30 ngày học HR nền tảng", "60 ngày tham gia tuyển dụng", "90 ngày triển khai dự án gắn kết"],
      },
    ],
  },
  C: {
    summary: "Cẩn trọng, logic và rất phù hợp vai trò yêu cầu chuẩn xác cao.",
    strengths: ["Phân tích", "Kiểm soát chất lượng", "Kỷ luật"],
    careers: [
      {
        name: "Business Analyst",
        description: "Phân tích yêu cầu và chuẩn hóa giải pháp cho sản phẩm.",
        majors: ["Hệ thống thông tin", "Kinh tế số"],
        skills: ["Thu thập yêu cầu", "Mô hình hóa quy trình", "Tài liệu hóa"],
        roadmap: ["30 ngày học BA foundation", "60 ngày viết BRD/SRS", "90 ngày tham gia dự án thực tế"],
      },
    ],
  },
};

function scoreByTrait(definition: AssessmentDefinition, answers: AnswerMap) {
  return definition.questions.reduce<Record<string, number>>((accumulator, question) => {
    const selectedOptionId = answers[question.id];
    const option = question.options.find((item) => item.id === selectedOptionId);
    if (!option) return accumulator;
    accumulator[option.trait] = (accumulator[option.trait] ?? 0) + option.score;
    return accumulator;
  }, {});
}

function getOrDefaultMapping(
  mapping: MappingValue | undefined,
  fallback: MappingValue,
): MappingValue {
  return mapping ?? fallback;
}

function flattenUnique(values: string[][]): string[] {
  return [...new Set(values.flat())];
}

export function evaluateAssessment(
  definition: AssessmentDefinition,
  answers: AnswerMap,
): AssessmentResult {
  const traitScores = scoreByTrait(definition, answers);

  if (definition.id === "mbti") {
    const code = ([
      traitScores.E >= traitScores.I ? "E" : "I",
      traitScores.S >= traitScores.N ? "S" : "N",
      traitScores.T >= traitScores.F ? "T" : "F",
      traitScores.J >= traitScores.P ? "J" : "P",
    ].join("") || "INTJ") as MbtiCode;

    const fallback = mbtiMapping.INTJ as MappingValue;
    const mapped = getOrDefaultMapping(mbtiMapping[code], fallback);

    return {
      testId: "mbti",
      code,
      summary: mapped.summary,
      highlightTraits: mapped.strengths,
      careers: mapped.careers,
      majorRecommendations: flattenUnique(mapped.careers.map((career) => career.majors)),
      skillsToBuild: flattenUnique(mapped.careers.map((career) => career.skills)),
      roadmap3090: flattenUnique(mapped.careers.map((career) => career.roadmap)),
    };
  }

  if (definition.id === "holland") {
    const sorted = Object.entries(traitScores).sort((a, b) => b[1] - a[1]);
    const code = sorted
      .slice(0, 3)
      .map(([trait]) => trait)
      .join("") || "IRC";
    const mapped = getOrDefaultMapping(hollandMapping[code], hollandMapping.IRC);

    return {
      testId: "holland",
      code,
      summary: mapped.summary,
      highlightTraits: mapped.strengths,
      careers: mapped.careers,
      majorRecommendations: flattenUnique(mapped.careers.map((career) => career.majors)),
      skillsToBuild: flattenUnique(mapped.careers.map((career) => career.skills)),
      roadmap3090: flattenUnique(mapped.careers.map((career) => career.roadmap)),
    };
  }

  const sorted = (Object.entries(traitScores) as Array<[DiscCode, number]>).sort(
    (a, b) => b[1] - a[1],
  );
  const primary = sorted[0]?.[0] ?? "C";
  const secondary = sorted[1]?.[0] ?? "S";
  const mapped = getOrDefaultMapping(discMapping[primary], discMapping.C);

  return {
    testId: "disc",
    code: `${primary}-${secondary}`,
    summary: mapped.summary,
    highlightTraits: mapped.strengths,
    careers: mapped.careers,
    majorRecommendations: flattenUnique(mapped.careers.map((career) => career.majors)),
    skillsToBuild: flattenUnique(mapped.careers.map((career) => career.skills)),
    roadmap3090: flattenUnique(mapped.careers.map((career) => career.roadmap)),
  };
}

export function buildDashboardInsights(results: AssessmentResult[]) {
  const strengths = flattenUnique(results.map((result) => result.highlightTraits)).slice(0, 6);
  const careers = results.flatMap((result) => result.careers);
  const majors = flattenUnique(results.map((result) => result.majorRecommendations)).slice(0, 8);
  const skills = flattenUnique(results.map((result) => result.skillsToBuild)).slice(0, 8);
  const roadmap = flattenUnique(results.map((result) => result.roadmap3090)).slice(0, 9);

  return {
    strengths,
    careers: careers.slice(0, 6),
    majors,
    skills,
    roadmap,
  };
}
