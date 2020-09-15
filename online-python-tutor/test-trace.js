trace = {
    "code": "int main() {\n  char *s = \"Hello World\";\n  char t[12] = \"Hello World\";\n  t[7] = s[5];\n  return 0;\n}",
    "trace": [
        {
            "event": "step_line",
            "func_name": "main",
            "globals": {},
            "heap": {},
            "line": 1,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {},
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 1,
                    "ordered_varnames": [],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        },
        {
            "event": "step_line",
            "func_name": "main",
            "globals": {},
            "heap": {},
            "line": 2,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {
                        "s": [
                            "C_DATA",
                            "0xFFF000BB8",
                            "pointer",
                            "<UNINITIALIZED>"
                        ],
                        "t": [
                            "C_ARRAY",
                            "0xFFF000BC0",
                            [
                                "C_DATA",
                                "0xFFF000BC0",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC1",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC2",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC3",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC4",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC5",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC6",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC7",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC8",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC9",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCA",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCB",
                                "char",
                                "<UNINITIALIZED>"
                            ]
                        ]
                    },
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 2,
                    "ordered_varnames": [
                        "s",
                        "t"
                    ],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        },
        {
            "event": "step_line",
            "func_name": "main",
            "globals": {},
            "heap": {
                "0x400644": [
                    "C_ARRAY",
                    "0x400644",
                    [
                        "C_DATA",
                        "0x400644",
                        "char",
                        "H"
                    ],
                    [
                        "C_DATA",
                        "0x400645",
                        "char",
                        "e"
                    ],
                    [
                        "C_DATA",
                        "0x400646",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x400647",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x400648",
                        "char",
                        "o"
                    ],
                    [
                        "C_DATA",
                        "0x400649",
                        "char",
                        " "
                    ],
                    [
                        "C_DATA",
                        "0x40064A",
                        "char",
                        "W"
                    ],
                    [
                        "C_DATA",
                        "0x40064B",
                        "char",
                        "o"
                    ],
                    [
                        "C_DATA",
                        "0x40064C",
                        "char",
                        "r"
                    ],
                    [
                        "C_DATA",
                        "0x40064D",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x40064E",
                        "char",
                        "d"
                    ],
                    [
                        "C_DATA",
                        "0x40064F",
                        "char",
                        "\\0"
                    ]
                ]
            },
            "line": 3,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {
                        "s": [
                            "C_DATA",
                            "0xFFF000BB8",
                            "pointer",
                            "0x400644"
                        ],
                        "t": [
                            "C_ARRAY",
                            "0xFFF000BC0",
                            [
                                "C_DATA",
                                "0xFFF000BC0",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC1",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC2",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC3",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC4",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC5",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC6",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC7",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC8",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC9",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCA",
                                "char",
                                "<UNINITIALIZED>"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCB",
                                "char",
                                "<UNINITIALIZED>"
                            ]
                        ]
                    },
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 2,
                    "ordered_varnames": [
                        "s",
                        "t"
                    ],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        },
        {
            "event": "step_line",
            "func_name": "main",
            "globals": {},
            "heap": {
                "0x400644": [
                    "C_ARRAY",
                    "0x400644",
                    [
                        "C_DATA",
                        "0x400644",
                        "char",
                        "H"
                    ],
                    [
                        "C_DATA",
                        "0x400645",
                        "char",
                        "e"
                    ],
                    [
                        "C_DATA",
                        "0x400646",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x400647",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x400648",
                        "char",
                        "o"
                    ],
                    [
                        "C_DATA",
                        "0x400649",
                        "char",
                        " "
                    ],
                    [
                        "C_DATA",
                        "0x40064A",
                        "char",
                        "W"
                    ],
                    [
                        "C_DATA",
                        "0x40064B",
                        "char",
                        "o"
                    ],
                    [
                        "C_DATA",
                        "0x40064C",
                        "char",
                        "r"
                    ],
                    [
                        "C_DATA",
                        "0x40064D",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x40064E",
                        "char",
                        "d"
                    ],
                    [
                        "C_DATA",
                        "0x40064F",
                        "char",
                        "\\0"
                    ]
                ]
            },
            "line": 4,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {
                        "s": [
                            "C_DATA",
                            "0xFFF000BB8",
                            "pointer",
                            "0x400644"
                        ],
                        "t": [
                            "C_ARRAY",
                            "0xFFF000BC0",
                            [
                                "C_DATA",
                                "0xFFF000BC0",
                                "char",
                                "H"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC1",
                                "char",
                                "e"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC2",
                                "char",
                                "l"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC3",
                                "char",
                                "l"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC4",
                                "char",
                                "o"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC5",
                                "char",
                                " "
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC6",
                                "char",
                                "W"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC7",
                                "char",
                                "o"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC8",
                                "char",
                                "r"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC9",
                                "char",
                                "l"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCA",
                                "char",
                                "d"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCB",
                                "char",
                                "\\0"
                            ]
                        ]
                    },
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 4,
                    "ordered_varnames": [
                        "s",
                        "t"
                    ],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        },
        {
            "event": "step_line",
            "func_name": "main",
            "globals": {},
            "heap": {
                "0x400644": [
                    "C_ARRAY",
                    "0x400644",
                    [
                        "C_DATA",
                        "0x400644",
                        "char",
                        "H"
                    ],
                    [
                        "C_DATA",
                        "0x400645",
                        "char",
                        "e"
                    ],
                    [
                        "C_DATA",
                        "0x400646",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x400647",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x400648",
                        "char",
                        "o"
                    ],
                    [
                        "C_DATA",
                        "0x400649",
                        "char",
                        " "
                    ],
                    [
                        "C_DATA",
                        "0x40064A",
                        "char",
                        "W"
                    ],
                    [
                        "C_DATA",
                        "0x40064B",
                        "char",
                        "o"
                    ],
                    [
                        "C_DATA",
                        "0x40064C",
                        "char",
                        "r"
                    ],
                    [
                        "C_DATA",
                        "0x40064D",
                        "char",
                        "l"
                    ],
                    [
                        "C_DATA",
                        "0x40064E",
                        "char",
                        "d"
                    ],
                    [
                        "C_DATA",
                        "0x40064F",
                        "char",
                        "\\0"
                    ]
                ]
            },
            "line": 5,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {
                        "s": [
                            "C_DATA",
                            "0xFFF000BB8",
                            "pointer",
                            "0x400644"
                        ],
                        "t": [
                            "C_ARRAY",
                            "0xFFF000BC0",
                            [
                                "C_DATA",
                                "0xFFF000BC0",
                                "char",
                                "H"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC1",
                                "char",
                                "e"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC2",
                                "char",
                                "l"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC3",
                                "char",
                                "l"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC4",
                                "char",
                                "o"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC5",
                                "char",
                                " "
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC6",
                                "char",
                                "W"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC7",
                                "char",
                                " "
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC8",
                                "char",
                                "r"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BC9",
                                "char",
                                "l"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCA",
                                "char",
                                "d"
                            ],
                            [
                                "C_DATA",
                                "0xFFF000BCB",
                                "char",
                                "\\0"
                            ]
                        ]
                    },
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 4,
                    "ordered_varnames": [
                        "s",
                        "t"
                    ],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        },
        {
            "event": "step_line",
            "func_name": "main",
            "globals": {},
            "heap": {},
            "line": 6,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {},
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 6,
                    "ordered_varnames": [],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        },
        {
            "event": "return",
            "func_name": "main",
            "globals": {},
            "heap": {},
            "line": 6,
            "ordered_globals": [],
            "stack_to_render": [
                {
                    "encoded_locals": {},
                    "frame_id": "0xFFF000BE0",
                    "func_name": "main",
                    "is_highlighted": true,
                    "is_parent": false,
                    "is_zombie": false,
                    "line": 6,
                    "ordered_varnames": [],
                    "parent_frame_id_list": [],
                    "unique_hash": "main_0xFFF000BE0"
                }
            ],
            "stdout": ""
        }
    ]
}