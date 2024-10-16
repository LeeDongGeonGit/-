import "../css/MemberCss/Membership.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export const MembershipPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [checkEmail, setCheckEmail] = useState(false);
    const [isId, setIsId] = useState(false);
    const [checkPW, setCheckPW] = useState(false);
    const [pwcheck, setPwcheck] = useState(" ");
    const [pwcheck1, setPwcheck1] = useState(" ");
    const [x_coordinate, setX_coordinate] = useState(null);
    const [y_coordinate, setY_coordinate] = useState(null);
    const [address, setAddress] = useState(null);
    const regExpPW = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    const regExpEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const idRef = useRef(null);
    const pwRef = useRef(null);
    const pwDuplicationRef = useRef(null);
    const emailRef = useRef(null);
    const nameRef = useRef(null);
    const numRef = useRef(null);
    const updatedPrevData = location.state?.updatedPrevData;

    useEffect(() => {
        if (updatedPrevData !== undefined) {
            console.log(updatedPrevData);
            nameRef.current.value = updatedPrevData.name;
            idRef.current.value = updatedPrevData.id;
            pwRef.current.value = updatedPrevData.pw;
            emailRef.current.value = updatedPrevData.email;
            numRef.current.value = updatedPrevData.num;
            pwDuplicationRef.current.value = updatedPrevData.pwDuplication;
            setCheckEmail(updatedPrevData.checkEmail);
            setIsId(updatedPrevData.isId);
            setCheckPW(updatedPrevData.checkPW);
            setX_coordinate(updatedPrevData.x_coordinate);
            setY_coordinate(updatedPrevData.y_coordinate);
            setAddress(updatedPrevData.address);
        }
    }, []);

    const goMap = () => {
        const prevData = {
            name: nameRef.current.value,
            id: idRef.current.value,
            pw: pwRef.current.value,
            email: emailRef.current.value,
            num: numRef.current.value,
            pwDuplication: pwDuplicationRef.current.value,
            checkEmail: checkEmail,
            isId: isId,
            checkPW: checkPW,
            x_coordinate: x_coordinate,
            y_coordinate: y_coordinate,
            address: address
        };
        console.log(prevData);
        navigate("/MembershipMapPage", { state: { prevData: prevData } });
    };

    const IdChangeHandler = () => {
        setIsId(false);
    };

    const pwChangeHandler = () => {
        let pw = pwRef.current.value;
        if (pw === "") {
            setPwcheck1(" ");
            setCheckPW(false);
        } else if (pw.match(regExpPW) === null || pw.match(regExpPW) === undefined) {
            setPwcheck1("영문, 숫자, 특수 문자 포함 8자이상 16자 이하로 입력");
            setCheckPW(false);
        } else {
            setPwcheck1(" ");
            setCheckPW(true);
        }
    };

    const CheckPWdDuplication = () => {
        let pw = pwRef.current.value;
        let pwDuplication = pwDuplicationRef.current.value;
        if (pwDuplication === "") {
            setPwcheck("");
            setCheckPW(false);
        } else if (pw !== pwDuplication) {
            setPwcheck("비밀번호가 일치하지 않습니다.");
            setCheckPW(false);
        } else {
            setPwcheck("");
            setCheckPW(true);
        }
    };

    const checkId = () => {
        let id = idRef.current.value;
        axios.get(`/user/${id}/checkid`).then(returnData => {
            if (returnData.data) {
                console.log(returnData.data);
                alert("이미 사용중인 아이디입니다.");
            } else {
                alert("사용 가능한 아이디입니다.");
                setIsId(true);
            }
        });
    };

    const checkEmailHandler = async () => {
        let email = emailRef.current.value;
        await axios
            .get(`/user/${email}/sendemail`)
            .then(returnData => {
                if (returnData.data) {
                    alert("인증번호를 보냈습니다.");
                } else {
                    alert("이미 존재하는 이메일입니다.");
                }
            })
            .catch(error => {
                console.error("Email send error: ", error);
                alert("서버 오류로 인증번호 전송에 실패했습니다.");
            });
    };

    const emailAuthentication = async () => {
        let email = emailRef.current.value;
        let num = numRef.current.value;
        try {
            const response = await axios.get(`/user/${email}/${num}/authentication`);
            if (response.data) {
                setCheckEmail(true);
                alert("이메일 인증 완료");
            } else {
                alert("인증번호가 틀렸습니다.");
            }
        } catch (error) {
            console.error("인증 과정에서 오류 발생:", error);
            alert("인증 과정에서 문제가 발생했습니다.");
        }
    };

    const validateInputs = () => {
        if (!nameRef.current.value) {
            alert("이름을 입력해주세요.");
            return false;
        } else if (!idRef.current.value) {
            alert("아이디를 입력해주세요.");
            return false;
        } else if (!pwRef.current.value) {
            alert("비밀번호를 입력해주세요.");
            return false;
        } else if (!emailRef.current.value) {
            alert("이메일을 입력해주세요.");
            return false;
        } else if (address === null) {
            alert("위치를 추가해주세요.");
            return false;
        }
        return true;
    };

    const signup = async () => {
        if (!validateInputs()) return;

        if (isId && checkPW && checkEmail) {
            let user = {
                name: nameRef.current.value,
                id: idRef.current.value,
                password: pwRef.current.value,
                email: emailRef.current.value,
                x_coordinate: x_coordinate,
                y_coordinate: y_coordinate,
                address: address
            };
            await axios.post(`/user`, user).then(returnData => {
                if (returnData.data) {
                    alert("가입이 완료됐습니다.");
                    navigate("/");
                } else {
                    alert("가입이 실패했습니다.");
                }
            });
        } else {
            if (!isId) alert("아이디를 확인해주세요");
            if (!checkPW) alert("비밀번호를 확인해주세요");
            if (!checkEmail) alert("이메일를 확인해주세요");
        }
    };

    return (
        <div className="Memrbership_Main">
            <div className="MP_img">
                <Link to="/"><img className="Membership_X" src="/img/Vector.png" alt="Close" /></Link>
                <img className="MP_Logo" src="/img/logo.PNG" alt="Logo" />
            </div>
            <div className="MP_title">
                <h1 className="MP_h2">회원가입</h1>
            </div>
            <div className="MP_inputcontainer">
                <div className="MP_inputBox">
                    <img className="MP_icon" src="/img/id.png" alt="아이디 아이콘" />
                    <input className="MP_inputcontainerid" type="text" placeholder="아이디" ref={idRef} onChange={IdChangeHandler} />
                    <button className="MP_overlapBtn" onClick={checkId}>중복확인</button>
                </div>
                <div className="NP_passwordBox">
                    <div className="MP_inputBox1234">
                        <img className="MP_icon" src="/img/pw.png" alt="비밀번호 아이콘" />
                        <input className="MP_inputcontainer2" type="password" ref={pwRef} onChange={pwChangeHandler} placeholder="비밀번호" />
                    </div>
                    <p className="MP_inputcontainer2P1">{pwcheck1}</p>
                    <div className="MP_inputBox">
                        <img className="MP_icon" src="/img/pw.png" alt="비밀번호 확인 아이콘" />
                        <input className="MP_inputcontainer2" type="password" ref={pwDuplicationRef} onChange={CheckPWdDuplication} placeholder="비밀번호 확인" />
                    </div>
                </div>
                <div className="MP_pwTexts">
                    <p className="MP_inputcontainer2Pa">{pwcheck}</p>
                </div>
                <div className="MP_inputBox123">
                    <img className="MP_icon" src="/img/id.png" alt="이름 아이콘" />
                    <input className="MP_inputNamecontainer1" ref={nameRef} type="text" placeholder="이름" />
                </div>
                <div className="MP_addressContainer MP_inputBox">
                    <img className="MP_icon123" src="/img/town.png" alt="우리 동네 입력 아이콘" />
                    <textarea
                        className="MP_inputcontainerTown"
                        placeholder="우리 동네 입력"
                        value={address}
                        readOnly
                    />
                    <button className="ML_mapBtn" onClick={goMap}>주소 찾기</button>
                </div>
                <div className="MP_EMcontainer MP_inputBox">
                    <img className="MP_icon" src="/img/email.png" alt="이메일 아이콘" />
                    <input className="MP_inputcontainerEm" type="text" placeholder="이메일" ref={emailRef} disabled={checkEmail} />
                    <button className="MP_checkBtn" onClick={checkEmailHandler}>전송</button>
                </div>
                <div className="MP_NUMcontainer MP_inputBox">
                    <img className="MP_icon" src="/img/email.png" alt="인증번호 아이콘" />
                    <input className="MP_inputcontainerNum" ref={numRef} type="text" placeholder="인증번호" />
                    <button className="MP_numcheckBtn" onClick={emailAuthentication}>확인</button>
                </div>
            </div>
            <div className="MP_btnBox">
                <button className="MP_btn" onClick={signup}>확인</button>
            </div>
        </div>
    );
};

export default MembershipPage;