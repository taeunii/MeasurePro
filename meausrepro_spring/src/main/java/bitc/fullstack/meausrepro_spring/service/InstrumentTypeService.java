package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import bitc.fullstack.meausrepro_spring.repository.InstrumentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InstrumentTypeService {
    @Autowired
    private InstrumentTypeRepository instrumentTypeRepository;

    // 계측기 저장
    public MeausreProInsType save(MeausreProInsType insType) {
        return instrumentTypeRepository.save(insType);
    }

    // 계측기 삭제
    public void deleteByInsId(int idx) {
        instrumentTypeRepository.deleteByInsId(idx);
    }
}