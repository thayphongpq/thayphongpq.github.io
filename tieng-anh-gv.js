/* ==========================================================================
   NỘI DUNG KHÓA "TIẾNG ANH CHO GIÁO VIÊN LÝ – TIN" (trang #/giao-vien)
   Mỗi bài có 10 câu, viết dạng ["câu tiếng Anh", "nghĩa tiếng Việt"].
   Thầy/cô có thể thêm câu hoặc thêm bài theo đúng mẫu.
   phan: "A" ngôn ngữ chung trong lớp, "B" số - đơn vị - công thức,
         "C" riêng cho Vật lý, "D" riêng cho Tin học.
   ========================================================================== */
window.GV_DU_LIEU = {
  phan: [
    { id: "A", ten: "Phần A. Ngôn ngữ chung trong lớp học", moTa: "Những câu dùng hằng ngày ở mọi môn: chào hỏi, giao nhiệm vụ, hỏi đáp, khen, nhận xét." },
    { id: "B", ten: "Phần B. Số, đơn vị và công thức", moTa: "Đọc số, đơn vị đo, công thức và đồ thị: nền tảng cho cả Vật lý và Tin học." },
    { id: "C", ten: "Phần C. Dạy Vật lý bằng tiếng Anh", moTa: "Câu theo chủ đề Vật lý THPT: chuyển động, lực, năng lượng, thí nghiệm, sóng, điện." },
    { id: "D", ten: "Phần D. Dạy Tin học bằng tiếng Anh", moTa: "Câu theo chủ đề Tin học THPT: phòng máy, đọc mã Python, thuật toán, gỡ lỗi, Internet, dữ liệu." }
  ],
  bai: [
    { id: "A1", phan: "A", capDo: "A1", ten: "Chào hỏi và bắt đầu giờ học", tenEn: "Greetings and starting the lesson", cau: [
      ["Good morning, everyone.", "Chào buổi sáng cả lớp."],
      ["Good afternoon, class.", "Chào buổi chiều cả lớp."],
      ["How are you today?", "Hôm nay các em thế nào?"],
      ["Please sit down.", "Các em ngồi xuống nhé."],
      ["Let's get started.", "Chúng ta bắt đầu nhé."],
      ["Today we are going to learn about motion.", "Hôm nay chúng ta sẽ học về chuyển động."],
      ["Let's review the last lesson.", "Chúng ta cùng ôn lại bài trước."],
      ["Take out your notebooks.", "Các em lấy vở ra."],
      ["Write down today's title.", "Các em ghi tên bài hôm nay."],
      ["Are you ready?", "Các em sẵn sàng chưa?"]
    ] },
    { id: "A2", phan: "A", capDo: "A1", ten: "Điểm danh và nề nếp lớp học", tenEn: "Attendance and classroom rules", cau: [
      ["Who is absent today?", "Hôm nay ai vắng mặt?"],
      ["Is everyone here?", "Cả lớp có mặt đủ chưa?"],
      ["Why are you late?", "Vì sao em đến muộn?"],
      ["Please be on time next time.", "Lần sau em đến đúng giờ nhé."],
      ["Please be quiet.", "Các em giữ trật tự."],
      ["Listen carefully.", "Các em nghe kĩ nhé."],
      ["Put your phones away, please.", "Các em cất điện thoại đi."],
      ["Don't talk while others are speaking.", "Không nói chuyện khi bạn khác đang phát biểu."],
      ["Raise your hand before you speak.", "Giơ tay trước khi phát biểu."],
      ["Respect your classmates.", "Hãy tôn trọng các bạn trong lớp."]
    ] },
    { id: "A3", phan: "A", capDo: "A1", ten: "Giao nhiệm vụ", tenEn: "Giving instructions", cau: [
      ["Open your books to page 25.", "Các em mở sách trang 25."],
      ["Look at the board, please.", "Các em nhìn lên bảng."],
      ["Read the text on page 30.", "Các em đọc đoạn văn trang 30."],
      ["Copy this into your notebook.", "Các em chép phần này vào vở."],
      ["Underline the key words.", "Gạch chân các từ khóa."],
      ["Answer questions one to three.", "Trả lời các câu hỏi từ 1 đến 3."],
      ["Close your books, please.", "Các em gấp sách lại."],
      ["Come to the board, please.", "Em lên bảng nhé."],
      ["Show me your answer.", "Cho thầy cô xem đáp án của em."],
      ["Do exercise two on your own.", "Các em tự làm bài tập 2."]
    ] },
    { id: "A4", phan: "A", capDo: "A1", ten: "Làm việc cặp đôi và nhóm", tenEn: "Pair work and group work", cau: [
      ["Work in pairs.", "Các em làm việc theo cặp."],
      ["Work in groups of four.", "Làm việc theo nhóm bốn người."],
      ["Turn to your partner.", "Quay sang bạn bên cạnh."],
      ["Discuss this question with your group.", "Thảo luận câu hỏi này với nhóm."],
      ["Choose a group leader.", "Các em chọn nhóm trưởng."],
      ["Share your ideas with the class.", "Chia sẻ ý kiến với cả lớp."],
      ["One person from each group, please report.", "Mỗi nhóm cử một bạn trình bày."],
      ["Swap papers with your partner.", "Đổi bài với bạn bên cạnh."],
      ["Help each other.", "Các em giúp đỡ nhau nhé."],
      ["Go back to your seats.", "Các em về chỗ ngồi."]
    ] },
    { id: "A5", phan: "A", capDo: "A2", ten: "Kiểm tra học sinh hiểu bài", tenEn: "Checking understanding", cau: [
      ["Is that clear?", "Các em hiểu chưa?"],
      ["Do you understand?", "Các em có hiểu không?"],
      ["Are there any questions?", "Có câu hỏi nào không?"],
      ["Can you say that again?", "Em nói lại được không?"],
      ["Can you explain why?", "Em giải thích vì sao được không?"],
      ["What does this word mean?", "Từ này nghĩa là gì?"],
      ["Put your thumbs up if you understand.", "Hiểu rồi thì giơ ngón cái lên."],
      ["Tell me in your own words.", "Em nói lại bằng lời của em."],
      ["Which part is difficult?", "Phần nào khó với các em?"],
      ["Let me explain it again.", "Thầy cô giải thích lại nhé."]
    ] },
    { id: "A6", phan: "A", capDo: "A2", ten: "Đặt câu hỏi", tenEn: "Asking questions", cau: [
      ["What is this?", "Đây là gì?"],
      ["What is the unit of force?", "Đơn vị của lực là gì?"],
      ["Which answer is correct?", "Đáp án nào đúng?"],
      ["True or false?", "Đúng hay sai?"],
      ["Why do you think so?", "Vì sao em nghĩ vậy?"],
      ["What happens if we increase the mass?", "Điều gì xảy ra nếu ta tăng khối lượng?"],
      ["Can you give an example?", "Em cho một ví dụ được không?"],
      ["How are these two methods different?", "Hai cách này khác nhau thế nào?"],
      ["Do you agree with her?", "Em có đồng ý với bạn ấy không?"],
      ["Who can answer this question?", "Bạn nào trả lời được câu này?"]
    ] },
    { id: "A7", phan: "A", capDo: "A2", ten: "Khen và động viên", tenEn: "Praise and encouragement", cau: [
      ["Well done!", "Làm tốt lắm!"],
      ["Excellent work!", "Bài làm xuất sắc!"],
      ["That's a great idea.", "Ý kiến rất hay."],
      ["Good try!", "Em cố gắng tốt lắm!"],
      ["You're nearly there.", "Gần đúng rồi."],
      ["Keep going!", "Cứ tiếp tục nhé!"],
      ["I'm proud of you.", "Thầy cô tự hào về em."],
      ["You've improved a lot.", "Em tiến bộ nhiều rồi."],
      ["Let's give him a big hand.", "Cả lớp vỗ tay cho bạn nào."],
      ["Don't give up.", "Đừng bỏ cuộc nhé."]
    ] },
    { id: "A8", phan: "A", capDo: "A2", ten: "Nhận xét và sửa lỗi", tenEn: "Feedback and correction", cau: [
      ["Not quite. Try again.", "Chưa đúng lắm, em thử lại nhé."],
      ["Check the units again.", "Em kiểm tra lại đơn vị."],
      ["Be careful with the sign.", "Cẩn thận với dấu âm, dương."],
      ["Don't worry, mistakes help us learn.", "Đừng lo, sai giúp ta học tốt hơn."],
      ["Could you explain that more clearly?", "Em giải thích rõ hơn được không?"],
      ["Can anyone help?", "Bạn nào giúp được không?"],
      ["Look at step two again.", "Em xem lại bước hai."],
      ["Your method is correct, but the answer is wrong.", "Cách làm đúng nhưng kết quả sai."],
      ["Thank you, that's a very clear answer.", "Cảm ơn em, câu trả lời rất rõ ràng."],
      ["Let's correct it together.", "Chúng ta cùng sửa nhé."]
    ] },
    { id: "A9", phan: "A", capDo: "A2", ten: "Quản lý thời gian và lớp học", tenEn: "Time and classroom management", cau: [
      ["You have five minutes.", "Các em có năm phút."],
      ["One more minute.", "Còn một phút nữa."],
      ["Time is up.", "Hết giờ rồi."],
      ["Stop writing, please.", "Các em dừng bút."],
      ["Hurry up, please.", "Các em nhanh lên nhé."],
      ["Let's take a short break.", "Chúng ta nghỉ giải lao một chút."],
      ["Please pay attention.", "Các em chú ý nhé."],
      ["Eyes on me, please.", "Các em nhìn lên đây."],
      ["Turn off the lights, please.", "Em tắt đèn giúp thầy cô."],
      ["Who is on duty today?", "Hôm nay ai trực nhật?"]
    ] },
    { id: "A10", phan: "A", capDo: "A2", ten: "Kết thúc giờ học và bài tập về nhà", tenEn: "Ending the lesson and homework", cau: [
      ["That's all for today.", "Hôm nay đến đây là hết."],
      ["Let's sum up the lesson.", "Chúng ta tóm tắt lại bài học."],
      ["What have we learned today?", "Hôm nay chúng ta đã học được gì?"],
      ["Your homework is exercise three on page 30.", "Bài tập về nhà là bài 3 trang 30."],
      ["Hand in your homework on Monday.", "Nộp bài tập vào thứ Hai."],
      ["Prepare the next lesson at home.", "Ở nhà các em chuẩn bị bài mới."],
      ["Don't forget your calculators next time.", "Buổi sau nhớ mang máy tính cầm tay."],
      ["There will be a quiz next week.", "Tuần sau có bài kiểm tra ngắn."],
      ["See you next time.", "Hẹn gặp lại buổi sau."],
      ["Goodbye, class.", "Tạm biệt cả lớp."]
    ] },
    { id: "B1", phan: "B", capDo: "A2", ten: "Số và phép tính", tenEn: "Numbers and operations", cau: [
      ["thirteen and thirty", "mười ba và ba mươi"],
      ["two hundred and forty-five", "hai trăm bốn mươi lăm"],
      ["nine point eight", "chín phẩy tám (9,8)"],
      ["zero point two five", "không phẩy hai lăm (0,25)"],
      ["one half, one third, three quarters", "một phần hai, một phần ba, ba phần tư"],
      ["x squared and x cubed", "x bình phương và x lập phương"],
      ["ten to the power of minus three", "mười mũ trừ ba"],
      ["a plus b equals c", "a cộng b bằng c"],
      ["a divided by b", "a chia cho b"],
      ["the square root of two", "căn bậc hai của hai"]
    ] },
    { id: "B2", phan: "B", capDo: "A2", ten: "Đơn vị và đại lượng", tenEn: "Units and quantities", cau: [
      ["metres per second", "mét trên giây"],
      ["metres per second squared", "mét trên giây bình phương"],
      ["The mass is two kilograms.", "Khối lượng là hai kilôgam."],
      ["The force is ten newtons.", "Lực có độ lớn mười niutơn."],
      ["The energy is fifty joules.", "Năng lượng là năm mươi jun."],
      ["The power of the lamp is sixty watts.", "Công suất của đèn là sáu mươi oát."],
      ["The temperature is twenty-five degrees Celsius.", "Nhiệt độ là hai mươi lăm độ C."],
      ["Convert kilometres per hour into metres per second.", "Đổi kilômét trên giờ sang mét trên giây."],
      ["What is the SI unit of energy?", "Đơn vị SI của năng lượng là gì?"],
      ["Round your answer to two decimal places.", "Làm tròn kết quả đến hai chữ số thập phân."]
    ] },
    { id: "B3", phan: "B", capDo: "A2", ten: "Đọc công thức và đồ thị", tenEn: "Formulas and graphs", cau: [
      ["v equals s over t.", "v bằng s chia t."],
      ["F equals m a.", "F bằng m nhân a."],
      ["v nought is the initial velocity.", "v không là vận tốc ban đầu."],
      ["Delta t is the time interval.", "Đenta t là khoảng thời gian."],
      ["The horizontal axis shows time.", "Trục hoành biểu diễn thời gian."],
      ["The vertical axis shows velocity.", "Trục tung biểu diễn vận tốc."],
      ["The graph is a straight line through the origin.", "Đồ thị là đường thẳng đi qua gốc tọa độ."],
      ["The slope of the graph gives the acceleration.", "Độ dốc của đồ thị cho biết gia tốc."],
      ["y is directly proportional to x.", "y tỉ lệ thuận với x."],
      ["Substitute the values into the formula.", "Thay số vào công thức."]
    ] },
    { id: "C1", phan: "C", capDo: "B1", ten: "Chuyển động", tenEn: "Motion", cau: [
      ["The car moves in a straight line.", "Ô tô chuyển động thẳng."],
      ["Speed is distance divided by time.", "Tốc độ bằng quãng đường chia thời gian."],
      ["Velocity has both magnitude and direction.", "Vận tốc có cả độ lớn và hướng."],
      ["Displacement is a vector quantity.", "Độ dịch chuyển là đại lượng vectơ."],
      ["The object is speeding up.", "Vật đang chuyển động nhanh dần."],
      ["The object is slowing down.", "Vật đang chuyển động chậm dần."],
      ["The acceleration is constant.", "Gia tốc không đổi."],
      ["A falling object accelerates at nine point eight metres per second squared.", "Vật rơi tự do có gia tốc 9,8 m/s²."],
      ["Let's choose the positive direction.", "Chúng ta chọn chiều dương."],
      ["Where do the two cars meet?", "Hai xe gặp nhau ở đâu?"]
    ] },
    { id: "C2", phan: "C", capDo: "B1", ten: "Lực và các định luật Newton", tenEn: "Forces and Newton's laws", cau: [
      ["A force is a push or a pull.", "Lực là sự đẩy hoặc kéo."],
      ["Draw all the forces acting on the box.", "Vẽ tất cả các lực tác dụng lên hộp."],
      ["The net force is zero.", "Hợp lực bằng không."],
      ["Friction acts in the opposite direction to motion.", "Lực ma sát ngược chiều chuyển động."],
      ["Weight is the force of gravity on an object.", "Trọng lượng là lực hấp dẫn tác dụng lên vật."],
      ["Newton's second law states that F equals m a.", "Định luật II Newton: F bằng m nhân a."],
      ["Every action has an equal and opposite reaction.", "Mỗi lực tác dụng đều có phản lực bằng và ngược chiều."],
      ["The object is in equilibrium.", "Vật ở trạng thái cân bằng."],
      ["Resolve the force into two components.", "Phân tích lực thành hai thành phần."],
      ["The tension in the string is twenty newtons.", "Lực căng dây là hai mươi niutơn."]
    ] },
    { id: "C3", phan: "C", capDo: "B1", ten: "Năng lượng, công và động lượng", tenEn: "Energy, work and momentum", cau: [
      ["Energy cannot be created or destroyed.", "Năng lượng không tự sinh ra cũng không tự mất đi."],
      ["Work is done when a force moves an object.", "Công được thực hiện khi lực làm vật dịch chuyển."],
      ["Kinetic energy depends on mass and speed.", "Động năng phụ thuộc khối lượng và tốc độ."],
      ["Gravitational potential energy depends on height.", "Thế năng trọng trường phụ thuộc độ cao."],
      ["Mechanical energy is conserved.", "Cơ năng được bảo toàn."],
      ["Power is the rate of doing work.", "Công suất là tốc độ thực hiện công."],
      ["The efficiency of the motor is eighty percent.", "Hiệu suất của động cơ là 80%."],
      ["Some energy is lost as heat.", "Một phần năng lượng bị hao phí dưới dạng nhiệt."],
      ["Momentum is mass times velocity.", "Động lượng bằng khối lượng nhân vận tốc."],
      ["Total momentum is conserved in a collision.", "Tổng động lượng được bảo toàn khi va chạm."]
    ] },
    { id: "C4", phan: "C", capDo: "B1", ten: "Thí nghiệm và an toàn phòng thí nghiệm", tenEn: "Experiments and lab safety", cau: [
      ["Today we will do an experiment.", "Hôm nay chúng ta sẽ làm thí nghiệm."],
      ["Put on your safety goggles.", "Đeo kính bảo hộ vào."],
      ["Don't touch the wires.", "Không chạm vào dây điện."],
      ["Set up the equipment as shown.", "Lắp dụng cụ như hình."],
      ["Measure the length of the string.", "Đo chiều dài sợi dây."],
      ["Record your results in the table.", "Ghi kết quả vào bảng."],
      ["Repeat the experiment three times.", "Lặp lại thí nghiệm ba lần."],
      ["Calculate the average value.", "Tính giá trị trung bình."],
      ["What is the source of error?", "Nguyên nhân gây sai số là gì?"],
      ["Write a conclusion.", "Viết kết luận."]
    ] },
    { id: "C5", phan: "C", capDo: "B1", ten: "Dao động và sóng", tenEn: "Oscillations and waves", cau: [
      ["The pendulum swings back and forth.", "Con lắc dao động qua lại."],
      ["The amplitude is five centimetres.", "Biên độ là năm xentimét."],
      ["The period is two seconds.", "Chu kì là hai giây."],
      ["Frequency is the number of oscillations per second.", "Tần số là số dao động trong một giây."],
      ["The wave travels from left to right.", "Sóng truyền từ trái sang phải."],
      ["The wavelength is the distance between two crests.", "Bước sóng là khoảng cách giữa hai đỉnh sóng liên tiếp."],
      ["Sound cannot travel through a vacuum.", "Âm không truyền được trong chân không."],
      ["The two waves interfere with each other.", "Hai sóng giao thoa với nhau."],
      ["This is a standing wave.", "Đây là sóng dừng."],
      ["Light is an electromagnetic wave.", "Ánh sáng là sóng điện từ."]
    ] },
    { id: "C6", phan: "C", capDo: "B1", ten: "Điện và từ", tenEn: "Electricity and magnetism", cau: [
      ["Connect the battery to the bulb.", "Nối pin với bóng đèn."],
      ["The current flows through the resistor.", "Dòng điện chạy qua điện trở."],
      ["The voltage across the lamp is six volts.", "Hiệu điện thế giữa hai đầu đèn là sáu vôn."],
      ["The resistors are connected in series.", "Các điện trở mắc nối tiếp."],
      ["The resistors are connected in parallel.", "Các điện trở mắc song song."],
      ["Ohm's law states that V equals I R.", "Định luật Ôm: U bằng I nhân R."],
      ["Like charges repel and opposite charges attract.", "Điện tích cùng dấu đẩy nhau, trái dấu hút nhau."],
      ["The magnetic field is strongest at the poles.", "Từ trường mạnh nhất ở hai cực."],
      ["Moving the magnet induces a current.", "Di chuyển nam châm làm xuất hiện dòng điện cảm ứng."],
      ["Never touch a socket with wet hands.", "Không chạm vào ổ điện khi tay ướt."]
    ] },
    { id: "D1", phan: "D", capDo: "B1", ten: "Trong phòng máy", tenEn: "In the computer lab", cau: [
      ["Turn on your computer.", "Các em bật máy tính."],
      ["Log in with your account.", "Đăng nhập bằng tài khoản của em."],
      ["Open the Python editor.", "Mở trình soạn thảo Python."],
      ["Create a new file.", "Tạo một tệp mới."],
      ["Save your file as lesson one.", "Lưu tệp với tên lesson one."],
      ["Click on the File menu.", "Nhấp vào menu File."],
      ["Double-click the icon.", "Nháy đúp vào biểu tượng."],
      ["Copy and paste the code.", "Sao chép và dán đoạn mã."],
      ["Don't install any software.", "Không tự cài đặt phần mềm."],
      ["Shut down the computer before you leave.", "Tắt máy trước khi ra về."]
    ] },
    { id: "D2", phan: "D", capDo: "B1", ten: "Đọc mã Python thành tiếng", tenEn: "Reading Python code aloud", cau: [
      ["Set x to ten.", "Gán cho x giá trị mười."],
      ["x is greater than five.", "x lớn hơn năm."],
      ["x is less than or equal to five.", "x nhỏ hơn hoặc bằng năm."],
      ["x is equal to y.", "x bằng y."],
      ["If the condition is true, print yes.", "Nếu điều kiện đúng thì in ra yes."],
      ["For i in range ten.", "Cho i chạy trong range(10)."],
      ["While n is greater than zero, repeat.", "Khi n còn lớn hơn 0 thì lặp lại."],
      ["Define a function called area.", "Định nghĩa một hàm tên là area."],
      ["The function returns the sum.", "Hàm trả về tổng."],
      ["Append the number to the list.", "Thêm số vào cuối danh sách."]
    ] },
    { id: "D3", phan: "D", capDo: "B1", ten: "Thuật toán", tenEn: "Algorithms", cau: [
      ["An algorithm is a list of steps to solve a problem.", "Thuật toán là dãy các bước để giải một bài toán."],
      ["What is the input? What is the output?", "Đầu vào là gì? Đầu ra là gì?"],
      ["Let's draw a flowchart.", "Chúng ta vẽ sơ đồ khối."],
      ["Sort the list in ascending order.", "Sắp xếp danh sách theo thứ tự tăng dần."],
      ["Search for the number in the list.", "Tìm số đó trong danh sách."],
      ["Binary search only works on a sorted list.", "Tìm kiếm nhị phân chỉ dùng cho danh sách đã sắp xếp."],
      ["Swap the two elements.", "Đổi chỗ hai phần tử."],
      ["The loop runs n times.", "Vòng lặp chạy n lần."],
      ["This algorithm is faster than that one.", "Thuật toán này nhanh hơn thuật toán kia."],
      ["Trace the algorithm step by step.", "Chạy tay thuật toán từng bước."]
    ] },
    { id: "D4", phan: "D", capDo: "B1", ten: "Gỡ lỗi chương trình", tenEn: "Debugging", cau: [
      ["The program has a bug.", "Chương trình có lỗi."],
      ["There is a syntax error on line five.", "Có lỗi cú pháp ở dòng năm."],
      ["Check the indentation.", "Kiểm tra lại thụt lề."],
      ["You forgot the colon.", "Em quên dấu hai chấm."],
      ["You are missing a bracket.", "Em thiếu một dấu ngoặc."],
      ["Read the error message carefully.", "Đọc kĩ thông báo lỗi."],
      ["The variable is not defined.", "Biến chưa được khai báo."],
      ["Run the program again.", "Chạy lại chương trình."],
      ["Test it with different inputs.", "Thử với các dữ liệu vào khác nhau."],
      ["The output is not what we expected.", "Kết quả không như mong đợi."]
    ] },
    { id: "D5", phan: "D", capDo: "B1", ten: "Internet và an toàn số", tenEn: "The Internet and digital safety", cau: [
      ["Connect to the school Wi-Fi.", "Kết nối Wi-Fi của trường."],
      ["Type the address into the browser.", "Gõ địa chỉ vào trình duyệt."],
      ["Search for information online.", "Tìm kiếm thông tin trên mạng."],
      ["Check if the website is reliable.", "Kiểm tra trang web có đáng tin không."],
      ["Never share your password.", "Không bao giờ chia sẻ mật khẩu."],
      ["Use a strong password.", "Dùng mật khẩu mạnh."],
      ["Don't click on suspicious links.", "Không nhấp vào đường link đáng ngờ."],
      ["Be polite when you chat online.", "Lịch sự khi trò chuyện trên mạng."],
      ["Respect copyright.", "Tôn trọng bản quyền."],
      ["Log out when you finish.", "Đăng xuất khi dùng xong."]
    ] },
    { id: "D6", phan: "D", capDo: "B1", ten: "Dữ liệu và cơ sở dữ liệu", tenEn: "Data and databases", cau: [
      ["A database stores data in tables.", "Cơ sở dữ liệu lưu dữ liệu trong các bảng."],
      ["Each row is a record.", "Mỗi hàng là một bản ghi."],
      ["Each column is a field.", "Mỗi cột là một trường."],
      ["The primary key identifies each record.", "Khóa chính xác định mỗi bản ghi."],
      ["Write a query to find the students.", "Viết truy vấn để tìm các học sinh."],
      ["Select all students in class ten A.", "Chọn tất cả học sinh lớp 10A."],
      ["Sort the data by score.", "Sắp xếp dữ liệu theo điểm."],
      ["Calculate the average score.", "Tính điểm trung bình."],
      ["Draw a chart from the data.", "Vẽ biểu đồ từ dữ liệu."],
      ["Back up your data regularly.", "Sao lưu dữ liệu thường xuyên."]
    ] }
  ],

  /* Bài kiểm tra đầu vào: 15 câu, từ dễ đến khó.
     loai: "nghia" (chọn nghĩa tiếng Việt), "chon" (chọn câu tiếng Anh đúng), "nghe" (nghe rồi chọn câu đã nghe). */
  kiemTra: [
    { loai: "nghia", en: "Good morning, everyone.", lc: ["Chào buổi sáng cả lớp.", "Tạm biệt cả lớp.", "Các em ngồi xuống.", "Hẹn gặp lại."], dung: 0 },
    { loai: "nghia", en: "Open your books to page 25.", lc: ["Gấp sách lại.", "Mở sách trang 25.", "Đọc trang 25 ở nhà.", "Mang sách lên bảng."], dung: 1 },
    { loai: "chon", vi: "Các em làm việc theo cặp.", lc: ["Work in pairs.", "Work in pears.", "Works on pair.", "Do pair work you."], dung: 0 },
    { loai: "nghe", en: "Please sit down.", lc: ["Please sit down.", "Please stand up.", "Please slow down.", "Please write down."], dung: 0 },
    { loai: "nghia", en: "What is the unit of force?", lc: ["Lực là gì?", "Đơn vị của lực là gì?", "Lực có mấy đơn vị?", "Ai tìm ra lực?"], dung: 1 },
    { loai: "chon", vi: "Em nào biết thì giơ tay.", lc: ["Rise your hand if you know.", "Raise your hand if you know.", "Raise your hands if you knows.", "Up hand if you know."], dung: 1 },
    { loai: "chon", vi: "Đọc 9,8 bằng tiếng Anh", lc: ["nine comma eight", "nine and eight", "nine point eight", "nine dot eighth"], dung: 2 },
    { loai: "chon", vi: "Đọc x² bằng tiếng Anh", lc: ["x two", "x squared", "x square two", "x double"], dung: 1 },
    { loai: "nghe", en: "Check the units again.", lc: ["Check the answer again.", "Check the units again.", "Change the units again.", "Check the unit test."], dung: 1 },
    { loai: "nghia", en: "The slope of the graph gives the acceleration.", lc: ["Đồ thị đi qua gốc tọa độ.", "Gia tốc bằng không.", "Độ dốc của đồ thị cho biết gia tốc.", "Trục tung biểu diễn gia tốc."], dung: 2 },
    { loai: "chon", vi: "Hôm nay chúng ta sẽ học về chuyển động.", lc: ["Today we go to learning about motion.", "Today we are going to learn about motion.", "Today we will learning motion.", "Today learn we about motion."], dung: 1 },
    { loai: "nghia", en: "Substitute the values into the formula.", lc: ["Thay số vào công thức.", "Rút gọn công thức.", "Chép công thức vào vở.", "Đổi đơn vị trong công thức."], dung: 0 },
    { loai: "nghe", en: "Read the error message carefully.", lc: ["Read the error message carefully.", "Write the error message clearly.", "Read the whole message carefully.", "Repeat the error message carefully."], dung: 0 },
    { loai: "chon", vi: "Gần đúng rồi, em thử lại nhé. (cách nói lịch sự)", lc: ["You are totally wrong.", "No. Next student.", "You're nearly there. Try again.", "Why you wrong?"], dung: 2 },
    { loai: "nghia", en: "Every action has an equal and opposite reaction.", lc: ["Mọi vật đều có quán tính.", "Mỗi lực tác dụng đều có phản lực bằng và ngược chiều.", "Hợp lực bằng không thì vật đứng yên.", "Lực ma sát ngược chiều chuyển động."], dung: 1 }
  ]
};
