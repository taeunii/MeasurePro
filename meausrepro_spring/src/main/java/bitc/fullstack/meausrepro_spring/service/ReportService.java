package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProReport;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.repository.ReportRepository;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
import bitc.fullstack.meausrepro_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SectionRepository sectionRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, SectionRepository sectionRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.sectionRepository = sectionRepository;
    }

    // 보고서 저장
    public MeausreProReport saveReport(MeausreProReport report, int sectionId, int userId) {
        // 유저 정보 조회
        MeausreProUser user = userRepository.findByIdx(userId).orElseThrow(() ->
                new IllegalArgumentException("유저가 존재하지 않습니다."));

        // 구간 정보 조회
        MeausreProSection section = sectionRepository.findByIdx(sectionId).orElseThrow(() ->
                new IllegalArgumentException("구간이 존재하지 않습니다."));

        // 보고서에 유저와 구간 정보 설정
        report.setUserIdx(user);
        report.setSectionId(section);

        return reportRepository.save(report);
    }

    // 구간별 보고서 가져옴
    public List<MeausreProReport> getReportsBySection(int sectionId) {
        MeausreProSection section = sectionRepository.findByIdx(sectionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 구간이 존재하지 않습니다."));
        return reportRepository.findBySectionId(section);
    }

    // 보고서 다운로드 파일 조회
    public Optional<MeausreProReport> getReportById(int reportId) {
        return reportRepository.findById(reportId);
    }
}
