export type AssessmentType = "mbti" | "holland" | "disc";

export type AssessmentOption = {
  id: string;
  label: string;
  trait: string;
  score: number;
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: AssessmentOption[];
};

export type AssessmentDefinition = {
  id: AssessmentType;
  title: string;
  description: string;
  estimatedMinutes: number;
  questions: AssessmentQuestion[];
};

const hollandScale = [
  { id: "1", label: "Rất không thích", score: 1 },
  { id: "2", label: "Không thích", score: 2 },
  { id: "3", label: "Bình thường", score: 3 },
  { id: "4", label: "Thích", score: 4 },
  { id: "5", label: "Rất thích", score: 5 },
];

function hollandOptions(trait: string): AssessmentOption[] {
  return hollandScale.map((item) => ({
    id: item.id,
    label: item.label,
    trait,
    score: item.score,
  }));
}

export const assessmentDefinitions: AssessmentDefinition[] = [
  {
    id: "mbti",
    title: "MBTI mini",
    description: "Xác định xu hướng tính cách làm việc theo 4 trục MBTI.",
    estimatedMinutes: 5,
    questions: [
      {
        id: "mbti-1",
        prompt: "Bạn nạp năng lượng tốt hơn khi...",
        options: [
          { id: "A", label: "Giao tiếp và hoạt động cùng nhiều người", trait: "E", score: 1 },
          { id: "B", label: "Ở không gian yên tĩnh để suy nghĩ riêng", trait: "I", score: 1 },
        ],
      },
      {
        id: "mbti-2",
        prompt: "Khi học điều mới, bạn thường...",
        options: [
          { id: "A", label: "Thích ví dụ thực tế, rõ ràng", trait: "S", score: 1 },
          { id: "B", label: "Thích ý tưởng tổng quát và khả năng tương lai", trait: "N", score: 1 },
        ],
      },
      {
        id: "mbti-3",
        prompt: "Khi quyết định quan trọng, bạn ưu tiên...",
        options: [
          { id: "A", label: "Tính logic và dữ liệu", trait: "T", score: 1 },
          { id: "B", label: "Tác động đến con người và cảm xúc", trait: "F", score: 1 },
        ],
      },
      {
        id: "mbti-4",
        prompt: "Bạn thấy thoải mái hơn khi lịch trình...",
        options: [
          { id: "A", label: "Được lên kế hoạch rõ trước", trait: "J", score: 1 },
          { id: "B", label: "Linh hoạt theo tình huống", trait: "P", score: 1 },
        ],
      },
      {
        id: "mbti-5",
        prompt: "Trong nhóm mới, bạn thường...",
        options: [
          { id: "A", label: "Bắt chuyện trước", trait: "E", score: 1 },
          { id: "B", label: "Quan sát rồi mới chia sẻ", trait: "I", score: 1 },
        ],
      },
      {
        id: "mbti-6",
        prompt: "Bạn dễ chú ý hơn đến...",
        options: [
          { id: "A", label: "Chi tiết hiện tại", trait: "S", score: 1 },
          { id: "B", label: "Ý nghĩa và xu hướng dài hạn", trait: "N", score: 1 },
        ],
      },
      {
        id: "mbti-7",
        prompt: "Khi tranh luận, bạn thường...",
        options: [
          { id: "A", label: "Đi thẳng vào vấn đề đúng sai", trait: "T", score: 1 },
          { id: "B", label: "Giữ hòa khí và cân nhắc cảm xúc", trait: "F", score: 1 },
        ],
      },
      {
        id: "mbti-8",
        prompt: "Bạn thích cách học/làm việc nào hơn?",
        options: [
          { id: "A", label: "Checklist rõ ràng, hoàn thành từng bước", trait: "J", score: 1 },
          { id: "B", label: "Khám phá tự do, điều chỉnh liên tục", trait: "P", score: 1 },
        ],
      },
      {
        id: "mbti-9",
        prompt: "Cuối tuần lý tưởng của bạn là...",
        options: [
          { id: "A", label: "Nhiều hoạt động với bạn bè", trait: "E", score: 1 },
          { id: "B", label: "Đọc, xem hoặc làm việc cá nhân", trait: "I", score: 1 },
        ],
      },
      {
        id: "mbti-10",
        prompt: "Bạn thường tin vào...",
        options: [
          { id: "A", label: "Kinh nghiệm đã kiểm chứng", trait: "S", score: 1 },
          { id: "B", label: "Linh cảm và ý tưởng mới", trait: "N", score: 1 },
        ],
      },
      {
        id: "mbti-11",
        prompt: "Với phản hồi tiêu cực, bạn hay...",
        options: [
          { id: "A", label: "Phân tích nội dung để cải thiện", trait: "T", score: 1 },
          { id: "B", label: "Quan tâm cách truyền đạt và cảm nhận", trait: "F", score: 1 },
        ],
      },
      {
        id: "mbti-12",
        prompt: "Bạn cảm thấy hiệu quả khi...",
        options: [
          { id: "A", label: "Hoàn thành việc sớm, đúng kế hoạch", trait: "J", score: 1 },
          { id: "B", label: "Làm tốt nhất vào gần hạn", trait: "P", score: 1 },
        ],
      },
    ],
  },
  {
    id: "holland",
    title: "Holland mini",
    description: "Đo mức độ yêu thích hoạt động theo 6 nhóm RIASEC.",
    estimatedMinutes: 6,
    questions: [
      { id: "hol-1", prompt: "Thiết kế hoặc sửa một sản phẩm kỹ thuật nhỏ", options: hollandOptions("R") },
      { id: "hol-2", prompt: "Phân tích dữ liệu để tìm quy luật", options: hollandOptions("I") },
      { id: "hol-3", prompt: "Vẽ, viết hoặc tạo nội dung sáng tạo", options: hollandOptions("A") },
      { id: "hol-4", prompt: "Hỗ trợ người khác giải quyết vấn đề học tập", options: hollandOptions("S") },
      { id: "hol-5", prompt: "Thuyết trình để thuyết phục một ý tưởng", options: hollandOptions("E") },
      { id: "hol-6", prompt: "Sắp xếp hồ sơ, số liệu theo quy trình", options: hollandOptions("C") },
      { id: "hol-7", prompt: "Lắp ráp thiết bị hoặc thao tác thực hành", options: hollandOptions("R") },
      { id: "hol-8", prompt: "Làm thí nghiệm và kiểm chứng giả thuyết", options: hollandOptions("I") },
      { id: "hol-9", prompt: "Sáng tác ý tưởng cho chiến dịch truyền thông", options: hollandOptions("A") },
      { id: "hol-10", prompt: "Lắng nghe và tư vấn định hướng cho bạn bè", options: hollandOptions("S") },
      { id: "hol-11", prompt: "Tổ chức một hoạt động và dẫn dắt nhóm", options: hollandOptions("E") },
      { id: "hol-12", prompt: "Kiểm tra lỗi, chuẩn hóa tài liệu", options: hollandOptions("C") },
    ],
  },
  {
    id: "disc",
    title: "DISC mini",
    description: "Xác định phong cách hành vi trong học tập và làm việc nhóm.",
    estimatedMinutes: 5,
    questions: [
      {
        id: "disc-1",
        prompt: "Khi nhóm bị chậm tiến độ, bạn thường...",
        options: [
          { id: "A", label: "Đưa quyết định nhanh để đẩy tiến độ", trait: "D", score: 1 },
          { id: "B", label: "Khích lệ mọi người giữ tinh thần", trait: "I", score: 1 },
          { id: "C", label: "Giữ nhịp ổn định, hỗ trợ từng thành viên", trait: "S", score: 1 },
          { id: "D", label: "Rà soát kế hoạch để giảm sai sót", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-2",
        prompt: "Trong buổi thảo luận, bạn thiên về...",
        options: [
          { id: "A", label: "Nói thẳng mục tiêu cần đạt", trait: "D", score: 1 },
          { id: "B", label: "Kết nối ý tưởng của nhiều người", trait: "I", score: 1 },
          { id: "C", label: "Lắng nghe để giữ sự đồng thuận", trait: "S", score: 1 },
          { id: "D", label: "Đặt câu hỏi để làm rõ tiêu chuẩn", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-3",
        prompt: "Bạn cảm thấy tự tin nhất khi...",
        options: [
          { id: "A", label: "Được giao nhiệm vụ thử thách cao", trait: "D", score: 1 },
          { id: "B", label: "Được giao tiếp, thuyết trình, lan tỏa", trait: "I", score: 1 },
          { id: "C", label: "Được làm trong môi trường ổn định", trait: "S", score: 1 },
          { id: "D", label: "Được làm việc với tiêu chuẩn rõ ràng", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-4",
        prompt: "Khi có xung đột trong nhóm, bạn thường...",
        options: [
          { id: "A", label: "Giải quyết trực diện, nhanh gọn", trait: "D", score: 1 },
          { id: "B", label: "Dùng giao tiếp để giảm căng thẳng", trait: "I", score: 1 },
          { id: "C", label: "Làm trung gian để mọi người hòa hợp", trait: "S", score: 1 },
          { id: "D", label: "Dựa vào quy tắc để xử lý công bằng", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-5",
        prompt: "Cách bạn phản ứng với thay đổi đột ngột là...",
        options: [
          { id: "A", label: "Nhanh chóng nắm quyền điều phối", trait: "D", score: 1 },
          { id: "B", label: "Hào hứng và kêu gọi mọi người thích ứng", trait: "I", score: 1 },
          { id: "C", label: "Quan sát, thích ứng dần để an toàn", trait: "S", score: 1 },
          { id: "D", label: "Đánh giá rủi ro rồi mới thay đổi", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-6",
        prompt: "Bạn thường được nhận xét là...",
        options: [
          { id: "A", label: "Mạnh mẽ, quyết liệt", trait: "D", score: 1 },
          { id: "B", label: "Năng động, truyền cảm hứng", trait: "I", score: 1 },
          { id: "C", label: "Kiên nhẫn, đáng tin cậy", trait: "S", score: 1 },
          { id: "D", label: "Cẩn thận, chính xác", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-7",
        prompt: "Khi nhận nhiệm vụ mới, bạn bắt đầu bằng cách...",
        options: [
          { id: "A", label: "Xác định mục tiêu và deadline ngay", trait: "D", score: 1 },
          { id: "B", label: "Trao đổi nhanh với mọi người liên quan", trait: "I", score: 1 },
          { id: "C", label: "Phân chia việc đều để cùng làm ổn định", trait: "S", score: 1 },
          { id: "D", label: "Lập checklist tiêu chuẩn chi tiết", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-8",
        prompt: "Trong dự án dài hạn, bạn giữ hiệu quả bằng cách...",
        options: [
          { id: "A", label: "Đặt mốc chinh phục cao hơn", trait: "D", score: 1 },
          { id: "B", label: "Tạo động lực bằng các hoạt động nhóm", trait: "I", score: 1 },
          { id: "C", label: "Duy trì nhịp làm việc đều đặn", trait: "S", score: 1 },
          { id: "D", label: "Theo dõi chất lượng và chi tiết kỹ thuật", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-9",
        prompt: "Nếu kế hoạch ban đầu không còn phù hợp, bạn sẽ...",
        options: [
          { id: "A", label: "Ra quyết định chuyển hướng nhanh", trait: "D", score: 1 },
          { id: "B", label: "Thuyết phục nhóm cùng đổi hướng", trait: "I", score: 1 },
          { id: "C", label: "Trao đổi để mọi người yên tâm trước", trait: "S", score: 1 },
          { id: "D", label: "Xây lại phương án theo tiêu chí rõ ràng", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-10",
        prompt: "Bạn ưu tiên môi trường học tập/làm việc...",
        options: [
          { id: "A", label: "Nhanh, cạnh tranh, nhiều mục tiêu", trait: "D", score: 1 },
          { id: "B", label: "Năng động, giao tiếp thường xuyên", trait: "I", score: 1 },
          { id: "C", label: "Ổn định, thân thiện, hợp tác", trait: "S", score: 1 },
          { id: "D", label: "Rõ quy chuẩn, chú trọng chất lượng", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-11",
        prompt: "Khi bị áp lực, bạn có xu hướng...",
        options: [
          { id: "A", label: "Tăng tốc để kiểm soát tình hình", trait: "D", score: 1 },
          { id: "B", label: "Tìm người trao đổi để có năng lượng", trait: "I", score: 1 },
          { id: "C", label: "Giữ bình tĩnh và làm từng bước", trait: "S", score: 1 },
          { id: "D", label: "Kiểm tra kỹ lại để tránh lỗi", trait: "C", score: 1 },
        ],
      },
      {
        id: "disc-12",
        prompt: "Bạn muốn được công nhận vì...",
        options: [
          { id: "A", label: "Kết quả nổi bật và tốc độ", trait: "D", score: 1 },
          { id: "B", label: "Khả năng truyền cảm hứng cho người khác", trait: "I", score: 1 },
          { id: "C", label: "Sự bền bỉ và tinh thần hỗ trợ", trait: "S", score: 1 },
          { id: "D", label: "Độ chuẩn xác và đáng tin cậy", trait: "C", score: 1 },
        ],
      },
    ],
  },
];

export const assessmentById = Object.fromEntries(
  assessmentDefinitions.map((item) => [item.id, item]),
) as Record<AssessmentType, AssessmentDefinition>;
