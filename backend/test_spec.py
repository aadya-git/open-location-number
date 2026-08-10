"""
Open Location Number (Dash Number) — Master Specification Verification Suite.

This script tests the official reference implementation `dash_number.py` against every rule
in `Open-Location-Number-Concept.md` and explicit user acceptance criteria.
"""

import unittest
from dash_number import (
    encode,
    decode,
    decode_area,
    validate,
    shorten,
    recover_nearest,
    damm_check_digit,
    clean_code
)

class TestOpenLocationNumberSpec(unittest.TestCase):

    def test_user_requested_exact_test_case(self):
        """
        Section 12 Test Case:
        Target: 28.475347, 77.092022 -> Full Code: 715 8740 7952 301-4
        Reference Locality: 28.48, 77.09
        Must produce valid 9-digit removal level short tail '52 301-4' and recover back 100%.
        """
        target_lat = 28.475347
        target_lon = 77.092022
        ref_lat = 28.48
        ref_lon = 77.09

        # 1. Encode Target Coordinates
        full_code = encode(target_lat, target_lon, grid_len=1)
        self.assertEqual(full_code, "715 8740 7952 301-4")

        # 2. Shorten relative to reference locality (28.48, 77.09)
        short_res = shorten(target_lat, target_lon, ref_lat, ref_lon, grid_len=1)
        self.assertIsNotNone(short_res)
        self.assertEqual(short_res.removed, 9)
        self.assertEqual(short_res.tail, "52 301-4")

        # 3. Recover relative to reference locality
        dec_res = recover_nearest(short_res.tail, ref_lat, ref_lon)
        self.assertTrue(dec_res.valid)
        
        recovered_code = encode(dec_res.latitude, dec_res.longitude, grid_len=1)
        self.assertEqual(recovered_code, full_code)

    def test_worked_example(self):
        """Test worked example from Concept Doc: (25.123456, 82.987654) -> 716 5219 2837 466-5"""
        formatted = encode(25.123456, 82.987654, grid_len=1)
        self.assertEqual(formatted, "716 5219 2837 466-5")

    def test_sub_metre_worked_example(self):
        """Test sub-metre worked example from Concept Doc: -> 716 5219 2837 466-583"""
        formatted = encode(25.123456, 82.987654, grid_len=3)
        self.assertEqual(formatted, "716 5219 2837 466-583")

    def test_damm_checksum_validity(self):
        """Test Damm algorithm returns matching check digit for backbone"""
        formatted = encode(25.123456, 82.987654, grid_len=0)
        digits = clean_code(formatted)
        backbone = digits[:13]
        check = int(digits[13])
        self.assertEqual(damm_check_digit(backbone), check)

    def test_single_typo_detection(self):
        """Test Damm checksum catches 100% of single digit substitutions"""
        # Alter position 5 digit ('2' -> '3')
        corrupted = "716 5319 2837 466-5"
        val = validate(corrupted)
        self.assertFalse(val['is_valid'])

    def test_adjacent_transposition_detection(self):
        """Test Damm checksum catches adjacent digit swaps"""
        # Swap positions 2 & 3 ('16' -> '61')
        corrupted = "761 5219 2837 466-5"
        val = validate(corrupted)
        self.assertFalse(val['is_valid'])

    def test_no_zero_in_grid_tail(self):
        """Test base-9 grid tail contains digits 1-9 only (never 0)"""
        for lat in [10.0, -45.5, 78.123]:
            for lon in [30.0, -120.0, 140.55]:
                formatted = encode(lat, lon, grid_len=4)
                hyphen_idx = formatted.find('-')
                if hyphen_idx != -1:
                    tail = formatted[hyphen_idx+1:].replace(" ", "")
                    self.assertNotIn('0', tail)

    def test_shortening_removal_levels(self):
        """Test shortening removal levels: 9, 7, 5, and too far"""
        lat, lon = 28.613939, 77.209021 # Delhi
        
        # Within 0.005° (~500m) -> 9 digits removed
        res9 = shorten(lat, lon, lat + 0.002, lon + 0.002, grid_len=1)
        self.assertEqual(res9.removed, 9)

        # Within 0.05° (~5km) -> 7 digits removed
        res7 = shorten(lat, lon, lat + 0.02, lon + 0.02, grid_len=1)
        self.assertEqual(res7.removed, 7)

        # Within 0.5° (~50km) -> 5 digits removed
        res5 = shorten(lat, lon, lat + 0.2, lon + 0.2, grid_len=1)
        self.assertEqual(res5.removed, 5)

        # Beyond 0.5° (>55km) -> Cannot shorten (None)
        res_none = shorten(lat, lon, lat + 1.0, lon + 1.0, grid_len=1)
        self.assertIsNone(res_none)

    def test_wrong_reference_recovery_fails(self):
        """Test recovery with a distant/wrong reference fails Damm checksum validation"""
        lat, lon = 28.613939, 77.209021
        short_res = shorten(lat, lon, lat + 0.002, lon + 0.002, grid_len=1)
        
        # Attempt recovery with far away reference (e.g. Mumbai ~1000km away)
        with self.assertRaises(ValueError):
            recover_nearest(short_res.tail, 19.076, 72.877)

if __name__ == '__main__':
    unittest.main()
