import { useEffect, useMemo, useState } from "react";
import useAuthentication from "../../hooks/useAuthentication";
import "./style/createclinicalrecord.css";
import { useForm } from "react-hook-form";
import useClinicalRecord from "../../hooks/useClinicalRecord";

const CreateClinicalRecord = ({ IdPatient, setIsCreating, handleClinicalRecordCreated }) => {
  const { User, getUser } = useAuthentication();
  const { createClinicalRecords } = useClinicalRecord();
   
  const [searchDoctor, setSearchDoctor] = useState("");
  const [showDoctors, setShowDoctors] = useState(false);
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getUser();
  }, []);

  // Crear la historia clinica
  const createClinicalRecord =  handleSubmit (async(data) => {
    if (!data.doctor_id) {
      setError("doctor_id", {
        type: "required",
        message: "Debes seleccionar un doctor de la lista.",
      });

      return;
    }
    const HistoryData = {
        patient_id: parseInt(IdPatient),
        doctor_id: data.doctor_id,
        state: true
    };
    try {
      await createClinicalRecords(HistoryData);
      alert("Historia clínica creada exitosamente.");
      setIsCreating(false);
      handleClinicalRecordCreated();
    }   catch (error) {
      console.error("Error al crear la historia clínica:", error);
      alert("Ocurrió un error al crear la historia clínica. Por favor, inténtalo de nuevo.");
    }
  });

  // Solo usuarios cuyo rol sea DOCTOR
  const doctors = useMemo(() => {
    return User?.filter((user) => user.role?.nameRole === "DOCTOR") || [];
  }, [User]);

  // Si no hay búsqueda, muestra TODOS los doctores.
  // Si hay búsqueda, filtra por nombre o CC.
  const filteredDoctors = useMemo(() => {
    if (!searchDoctor.trim()) {
      return doctors;
    }

    const search = searchDoctor.toLowerCase();

    return doctors.filter(
      (doctor) =>
        doctor.names.toLowerCase().includes(search) ||
        doctor.cc.includes(search),
    );
  }, [doctors, searchDoctor]);

  const handleSelectDoctor = (doctor) => {
    setSearchDoctor(doctor.names);
    setShowDoctors(false);
    setValue("doctor_id", doctor.id);
    clearErrors("doctor_id");
  };

  return (
    <div className="create-clinical-record">
      <h1 className="create-clinical-record__title">Crear Historia Clínica</h1>

      <p className="create-clinical-record__subtitle">
        Registra la información clínica del paciente y asigna el profesional
        responsable.
      </p>

      <form
        className="create-clinical-record__form"
        onSubmit={createClinicalRecord}
      >
        <div className="create-clinical-record__field">
          <label htmlFor="DoctorId">Doctor</label>

          <input
            type="text"
            id="DoctorId"
            value={searchDoctor}
            placeholder="Buscar doctor por nombre o CC..."
            onFocus={() => setShowDoctors(true)}
            onChange={(e) => {
              setSearchDoctor(e.target.value);
              setValue("doctor_id", "");
              setShowDoctors(true);
            }}
          />
          {errors.doctor_id && (
            <span className="create-clinical-record__error">
              {errors.doctor_id.message}
            </span>
          )}
          {showDoctors && (
            <div className="create-clinical-record__doctor-list">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <button
                    type="button"
                    key={doctor.id}
                    className="create-clinical-record__doctor-option"
                    onClick={() => handleSelectDoctor(doctor)}
                  >
                    <strong>{doctor.names}</strong>

                    <span>CC: {doctor.cc}</span>
                  </button>
                ))
              ) : (
                <p className="create-clinical-record__no-results">
                  No se encontraron doctores.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="create-clinical-record__actions">
          <button type="submit" className="create-clinical-record__button">
            Crear Historia Clínica
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClinicalRecord;
