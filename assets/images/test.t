#!/usr/bin/perl
use strict;
use warnings;
use Test::Simple tests => 3;

# Test 1: Basic arithmetic
ok(1 + 1 == 2, 'Addition works');

# Test 2: String comparison
ok('hello' eq 'hello', 'String comparison works');

# Test 3: Array operations
my @arr = (1, 2, 3);
ok(scalar(@arr) == 3, 'Array has 3 elements');