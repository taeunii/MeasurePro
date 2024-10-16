import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function InsDetailSideBar(props) {
    const { instrument, handleClose, deleteInstrument, handleInstrumentUpdated } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const dateNow = new Date();
    const today = dateNow.toISOString().slice(0, 10); // 'yyyy-mm-dd' 형식으로 오늘 날짜를 얻음

    // 계측기 데이터 또는 기본값으로 상태 초기화
    const [insType, setInsType] = useState(instrument?.insType || '');
    const [insNum, setInsNum] = useState(instrument?.insNum || '');
    const [insName, setInsName] = useState(instrument?.insName || '');
    const [insNo, setInsNo] = useState(instrument?.insNo || '');
    const [createDate, setCreateDate] = useState(instrument?.createDate || today);
    const [insLocation, setInsLocation] = useState(instrument?.insLocation || '');
    const [measurement1, setMeasurement1] = useState(instrument?.measurement1 || 0);
    const [measurement2, setMeasurement2] = useState(instrument?.measurement2 || 0);
    const [measurement3, setMeasurement3] = useState(instrument?.measurement3 || 0);
    const [verticalPlus, setVerticalPlus] = useState(instrument?.verticalPlus || 0);
    const [verticalMinus, setVerticalMinus] = useState(instrument?.verticalMinus || 0);

    const [insTypeName, setInsTypeName] = useState('');
    useEffect(() => {
        switch (insType){
            case 'A': setInsTypeName('하중계 버팀대');
                break;
            case 'B': setInsTypeName('하중계 PSBEAM');
                break;
            case 'C': setInsTypeName('하중계 앵커');
                break;
            case 'D': setInsTypeName('변형률계');
                break;
            case 'E': setInsTypeName('구조물 기울기계');
                break;
            case 'F': setInsTypeName('균열측정계');
                break;
        }
    }, [insType])

    const parseGeometryData = (data) => {
        if (!data || !data.startsWith('POINT(')) {
            return '정보 없음';
        }
        const coordinates = data.slice(6, -1).split(' ');
        if (coordinates.length === 2) {
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            return `경도: ${longitude}, 위도: ${latitude}`;
        }
        return '정보 없음';
    };

    // 닫기 처리
    const handleCloseClick = () => {
        setIsOpen(false);
        setTimeout(() => {
            handleClose();
        }, 300);
    };

    useEffect(() => {
        setIsOpen(true);
    }, []);

    // 수정 모드 토글
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // 수정된 데이터 저장
    const saveChanges = () => {
        axios.put('http://localhost:8080/MeausrePro/Instrument/update', {
            idx: instrument.idx,
            insName,
            insType,
            insLocation,
            insNum,
            insNo,
            createDate,
            verticalPlus,
            verticalMinus,
            measurement1,
            measurement2,
            measurement3
        })
            .then((res) => {
                console.log(res);
                const updatedInstrument = {
                    ...instrument,
                    insName,
                    insType,
                    insLocation,
                    insNum,
                    insNo,
                    createDate,
                    verticalPlus,
                    verticalMinus,
                    measurement1,
                    measurement2,
                    measurement3
                };
                handleInstrumentUpdated(updatedInstrument);  // 부모 컴포넌트에 업데이트된 데이터를 전달
                toggleEdit();  // 수정 모드 종료
            })
            .catch((err) => {
                console.error("계측기 수정 중 오류 발생:", err);
            });
    };

    // 계측기 삭제
    const handleDelete = () => {
        Swal.fire({
            title: '계측기 삭제',
            text: "이 계측기를 삭제하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteInstrument(instrument.idx); // 삭제 함수 호출
            }
        });
    };

    return (
        <div className={`sectionDetailSideBar ${isOpen ? 'open' : ''}`}>
            <div className={'sideBarHeader'}>
                <span className={'fw-bold sectionSideBarTitle'}>계측기 상세 정보</span>
                <div className={'d-flex gap-2'}>
                    <button
                        type={'button'}
                        onClick={isEditing ? saveChanges : toggleEdit}  // 저장 및 수정 모드 전환
                        className={'sideBarBtn projectUpdate'}
                    >
                        {isEditing ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-floppy2-fill" viewBox="0 0 16 16">
                                <path d="M12 2h-2v3h2z"/>
                                <path
                                    d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                 fill="currentColor" className="bi bi-pencil-square"
                                 viewBox="0 0 16 16">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                        )}
                    </button>
                    <button
                        className={'sideBarBtn projectDelete'}
                        onClick={handleDelete}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-trash3" viewBox="0 0 16 16">
                            <path
                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                    <button
                        className={'sideBarBtn'}
                        onClick={handleCloseClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                             className="bi bi-x" viewBox="0 0 16 16">
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={'d-flex flex-column gap-2'}>
                {isEditing ? (
                    <div className={'projectDetail'}>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>계측기명</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={insName}
                                    onChange={(e) => setInsName(e.target.value)}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>계측기 관리번호</span>
                                <input
                                    type={'text'}
                                    className={'form-control'}
                                    value={insNum}
                                    onChange={(e) => setInsNum(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>시리얼 NO</span>
                            <input
                                type={'text'}
                                className={'form-control'}
                                value={insNo}
                                onChange={(e) => setInsNo(e.target.value)}
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>계측기 종류</span>
                            <input
                                type={'text'}
                                className={'form-control'}
                                value={insTypeName}
                                readOnly
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>설치 위치</span>
                            <input
                                type={'text'}
                                className={'form-control'}
                                value={insLocation}
                                onChange={(e) => setInsLocation(e.target.value)}
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>설치일자</span>
                            <input
                                type={'date'}
                                className={'form-control'}
                                value={createDate}
                                onChange={(e) => setCreateDate(e.target.value)}
                            />
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>지오메트리 정보</span>
                            <input
                                type={'text'}
                                className={'form-control'}
                                value={parseGeometryData(instrument?.insGeometry)}
                                readOnly
                            />
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>관리기준치1차</span>
                                <input
                                    type={'number'}
                                    className={'form-control'}
                                    value={measurement1}
                                    onChange={(e) => setMeasurement1(e.target.value)}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>관리기준치2차</span>
                                <input
                                    type={'number'}
                                    className={'form-control'}
                                    value={measurement2}
                                    onChange={(e) => setMeasurement2(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={'d-flex flex-column gap-1'}>
                            <span className={'text-muted small'}>관리기준치3차</span>
                            <input
                                type={'number'}
                                className={'form-control'}
                                value={measurement3}
                                onChange={(e) => setMeasurement3(e.target.value)}
                            />
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>수직변위(+Y)</span>
                                <input
                                    type={'number'}
                                    className={'form-control'}
                                    value={verticalPlus}
                                    onChange={(e) => setVerticalPlus(e.target.value)}
                                />
                            </div>
                            <div className={'col-sm d-flex flex-column gap-1'}>
                                <span className={'text-muted small'}>수직변위(-Y)</span>
                                <input
                                    type={'number'}
                                    className={'form-control'}
                                    value={verticalMinus}
                                    onChange={(e) => setVerticalMinus(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={'projectDetail'}>
                        <span className={'text-muted small'}>계측기명</span>
                        <span>{instrument?.insName}</span>
                        <span className={'text-muted small'}>계측기 관리번호</span>
                        <span>{instrument?.insNum}</span>
                        <span className={'text-muted small'}>시리얼 NO</span>
                        <span>{instrument?.insNo}</span>
                        <span className={'text-muted small'}>계측기 종류</span>
                        <span>{insTypeName}</span>
                        <span className={'text-muted small'}>설치 위치</span>
                        <span>{instrument?.insLocation}</span>
                        <span className={'text-muted small'}>설치일자</span>
                        <span>{instrument?.createDate}</span>
                        <span className={'text-muted small'}>지오메트리 정보</span>
                        <span>{parseGeometryData(instrument?.insGeometry)}</span>
                        <span className={'text-muted small'}>관리기준치1차</span>
                        <span>{instrument?.measurement1}</span>
                        <span className={'text-muted small'}>관리기준치2차</span>
                        <span>{instrument?.measurement2}</span>
                        <span className={'text-muted small'}>관리기준치3차</span>
                        <span>{instrument?.measurement3}</span>
                        <span className={'text-muted small'}>수직변위(+Y)</span>
                        <span>{instrument?.verticalPlus}</span>
                        <span className={'text-muted small'}>수직변위(-Y)</span>
                        <span>{instrument?.verticalMinus}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InsDetailSideBar;
