export async function GET(request) {
  try {
    // Dummy ABHA Profile
    const dummyProfile = {
      abhaId: "23-4567-8901-2345",
      name: "Rahul Sharma",
      gender: "male",
      dob: "1995-08-14",
      mobile: "+91-9876543210",
    };

    // Generate FHIR Patient resource
    const fhirPatient = {
      resourceType: "Patient",
      id: dummyProfile.abhaId.replace(/-/g, ""),
      text: {
        status: "generated",
        div: `<div xmlns="http://www.w3.org/1999/xhtml">
            <p><b>${dummyProfile.name}</b></p>
            <p>Gender: ${dummyProfile.gender}</p>
            <p>Date of Birth: ${dummyProfile.dob}</p>
            <p>Mobile: ${dummyProfile.mobile}</p>
          </div>`,
      },
      identifier: [
        {
          system: "https://abdm.gov.in/healthid",
          value: dummyProfile.abhaId,
        },
      ],
      name: [
        {
          use: "official",
          text: dummyProfile.name,
          family: dummyProfile.name.split(" ").slice(-1)[0],
          given: dummyProfile.name.split(" ").slice(0, -1),
        },
      ],
      gender: dummyProfile.gender,
      birthDate: dummyProfile.dob,
      telecom: [
        {
          system: "phone",
          value: dummyProfile.mobile,
          use: "mobile",
        },
      ],
    };

    return new Response(JSON.stringify(fhirPatient, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
