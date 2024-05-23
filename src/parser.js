// Will normalize recived data from update for the talent object
export default function convertObject(flatObject) {
  const nestedObject = {
    name: flatObject.name,
    lastname: flatObject.lastname,
    image: flatObject.image,
    contact: {
      address: flatObject["contact[address]"],
      phone: flatObject["contact[phone]"],
      email: flatObject["contact[email]"],
    },
    objective: flatObject.objective,
    qualifications: [],
    education: [],
    experience: [],
  };

  // Fill qualifications
  Object.keys(flatObject).forEach((key) => {
    if (key.startsWith("qualifications[")) {
      nestedObject.qualifications.push(flatObject[key]);
    }
  });

  // Fill education
  const education = {};
  Object.keys(flatObject).forEach((key) => {
    if (key.startsWith("education[")) {
      const match = key.match(/education\[(\w+)\]\[(\d+)\](?:\[(\d+)\])?/);
      if (match) {
        const [_, field, index, subIndex] = match;
        if (!education[index]) {
          education[index] = {};
        }
        if (!education[index][field]) {
          education[index][field] = [];
        }
        if (subIndex !== undefined) {
          if (!education[index][field][subIndex]) {
            education[index][field][subIndex] = [];
          }
          education[index][field][subIndex] = flatObject[key];
        } else {
          education[index][field] = flatObject[key];
        }
      }
    }
  });

  // Format education details correctly
  nestedObject.education = Object.values(education).map((edu) => ({
    degree: edu.degree,
    institution: edu.institution,
    details: edu.details ? Object.values(edu.details) : [],
  }));

  // Fill experience
  const experience = {};
  Object.keys(flatObject).forEach((key) => {
    if (key.startsWith("experience[")) {
      const match = key.match(/experience\[(\w+)\]\[(\d+)\](?:\[(\d+)\])?/);
      if (match) {
        const [_, field, index, subIndex] = match;
        if (!experience[index]) {
          experience[index] = {};
        }
        if (!experience[index][field]) {
          experience[index][field] = [];
        }
        if (subIndex !== undefined) {
          if (!experience[index][field][subIndex]) {
            experience[index][field][subIndex] = [];
          }
          experience[index][field][subIndex] = flatObject[key];
        } else {
          experience[index][field] = flatObject[key];
        }
      }
    }
  });

  // Format experience details correctly
  nestedObject.experience = Object.values(experience).map((exp) => ({
    title: exp.title,
    organization: exp.organization,
    duration: exp.duration,
    details: exp.details ? Object.values(exp.details) : [],
  }));

  return nestedObject;
}
