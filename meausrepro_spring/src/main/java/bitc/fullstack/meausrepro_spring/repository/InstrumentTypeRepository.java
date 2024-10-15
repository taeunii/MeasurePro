package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface InstrumentTypeRepository extends JpaRepository<MeausreProInsType, String> {
    // 계측기 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM MeausreProInsType s WHERE s.instrId.idx = :idx")
    void deleteByInsId(int idx);
}
