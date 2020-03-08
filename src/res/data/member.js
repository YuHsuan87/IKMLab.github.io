import placeholder from 'src/res/image/member/placeholder.jpg'

export const memberData = [
  {
    zh: '寒山',
    en: 'Tim Niven',
    dept: 0,
    deg: 0,
    image: placeholder,
  },
  {
    zh: '周子軒',
    en: 'Tzu Hsuan Chou',
    dept: 0,
    deg: 0,
  },
  {
    zh: '吳貞頤',
    en: 'Iris Wu',
    dept: 0,
    deg: 1,
  },
  {
    zh: '陳比恩',
    en: 'Daniel Chen',
    dept: 1,
    deg: 1,
  },
  {
    zh: '陳冠友',
    en: 'Guan Yo Chen',
    dept: 2,
    deg: 1,
  },
  {
    zh: '黃獻德',
    en: 'Ton Ton Huang',
    dept: 0,
    deg: 0,
    year: 2019,
  },
  {
    zh: '葉修宏',
    en: 'Hsu Hong Yeh',
    dept: 0,
    deg: 1,
    year: 2018,
  },
]

export default memberData
export const parsingRule = {
  deg: [
    'phd', // 0 for phd degree
    'master', // 1 for master degree
  ],
  dept: [
    'CSIE', // 0 for Computer Science and Information Engineering
    'IMI', // 1 for Institute of Medical Informatics
    'AIMP', // 2 for Artificial Intelligence Technology Master Program
  ],
}

const schemaCheck = () => {
  // We use the json-schema.org spec.
  // See https://json-schema.org/specification.html
  const schema = {
    description: 'An array of members data.',
    type: 'array',
    items: {
      description: 'Member data.',
      type: 'object',
      required: ['deg', 'dept'],
      properties: {
        zh: {
          description: 'Chinese name of a member.',
          type: 'string',
        },
        en: {
          description: 'English name of a member.',
          type: 'string',
        },
        deg: {
          description: 'Degree of a member.',
          type: 'number',
        },
        dept: {
          description: 'Belonged department of a member.',
          type: 'number',
        },
        year: {
          description: 'Year of graduation',
          type: 'number',
        },
        image: {
          description: 'Member\'s photo',
          type: 'string',
        },
      },
    },
  }

  const validator = (input, type) => {
    if (type === 'array') {
      return Array.isArray(input)
    }
    return (typeof input) === type
  }

  // Check each field with above schema. `memberData` must be an array,
  // so this one will be written explicitly.
  if (!validator(memberData, 'array')) {
    throw new Error(`memberData is not type array.`)
  }

  memberData.forEach((member) => {
    // Items in `memberData` must be an object, so this one will
    // also be written explicitly.
    if (!validator(member, 'object')) {
      throw new Error(`memberData is not type object.`)
    }

    // Check if Chinese name is filled.
    let useZh = false
    if (member.zh) {
      useZh = true
      if (!validator(member.zh, schema.items.properties.zh.type)) {
        throw new Error(
            `memberData.zh is not type ${schema.items.properties.zh.type}.`,
        )
      }
    }

    // Check if English name is filled.
    let useEn = false
    if (member.en) {
      useEn = true
      if (!validator(member.en, schema.items.properties.en.type)) {
        throw new Error(
            `memberData.en is not type ${schema.items.properties.en.type}.`,
        )
      }
    }

    // Throw if both names are not filled.
    if (!(useZh || useEn)) {
      throw new Error(
          `At least one of memberData.zh or memberData.en must be filled.`,
      )
    }

    // Check if degree is filled with correct range.
    if (!validator(member.deg, schema.items.properties.deg.type) ||
    !validator(parsingRule.deg[member.deg], 'string')) {
      throw new Error(
          `memberData.deg must be in range [0, ${parsingRule.deg.length - 1}].`,
      )
    }
    // Check if department is filled with correct range.
    if (!validator(member.dept, schema.items.properties.dept.type) ||
    !validator(parsingRule.dept[member.dept], 'string')) {
      throw new Error(
          `memberData.dept must be in range [0, ${
            parsingRule.dept.length - 1
          }].`,
      )
    }

    // Check if graduate year is filled with correct range.
    if (member.year) {
      if (!validator(member.year, schema.items.properties.year.type) ||
      member.year < 1990 ||
      member.year > new Date(Date.now()).getFullYear()) {
        throw new Error(
            `memberData.year must be in range [1990, ${
              new Date(Date.now()).getFullYear()
            }].`,
        )
      }
    }

    if (member.image) {
      if (!validator(member.image, schema.items.properties.image.type)) {
        throw new Error(
            'member.image should be imported in file: '+
          'src/res/data/member.js',
        )
      }
    } else {
      // Use a placeholde for member's image.
      member.image = placeholder
    }
  })
}

schemaCheck()
