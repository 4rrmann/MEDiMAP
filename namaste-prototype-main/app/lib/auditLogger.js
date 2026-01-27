// lib/auditLogger.js

// Generate a random doctor ID and system per session
const randomNum = Math.floor(Math.random() * 1000000);
const doctorId = `doctor-${randomNum}`;
const doctorSystem = `urn:doctor-id-${randomNum}`;

export function logAuditEvent(action, entity, outcome = "0") {
  const auditEvent = {
    resourceType: "AuditEvent",
    type: { code: "rest", display: "RESTful Operation" },
    action,
    recorded: new Date().toISOString(),
    outcome,
    agent: [
      {
        who: {
          identifier: {
            system: doctorSystem, // randomized system
            value: doctorId,      // randomized value
          },
        },
        requestor: true,
      },
    ],
    entity: [
      {
        what: { reference: entity },
      },
    ],
  };

  console.log("AUDIT LOG:", JSON.stringify(auditEvent, null, 2));
}
