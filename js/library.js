// Library of coding problems organized hierarchically
window.problemLibrary = {
    "Blind75": {
        "Array": {
            "Two Sum ⭐": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
            "Best Time to Buy and Sell Stock": "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
            "Contains Duplicate": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
            "Product of Array Except Self": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
            "Maximum Subarray": "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
            "Maximum Product Subarray": "Given an integer array nums, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.",
            "Find Minimum in Rotated Sorted Array": "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n\n[4,5,6,7,0,1,2] if it was rotated 4 times.\n[0,1,2,4,5,6,7] if it was rotated 7 times.\n\nNotice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.",
            "Search in Rotated Sorted Array": "There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.",
            "3Sum": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
            "Container With Most Water": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container."
        },
        "Binary": {
            "Sum of Two Integers": "Given two integers a and b, return the sum of the two integers without using the operators + and -.",
            "Number of 1 Bits": "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).",
            "Counting Bits": "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.",
            "Missing Number": "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
            "Reverse Bits": "Reverse bits of a given 32 bits unsigned integer."
        },
        "Dynamic Programming": {
            "Climbing Stairs": "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            "Coin Change": "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
            "Longest Increasing Subsequence ⭐": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
            "Longest Common Subsequence": "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
            "Word Break ⭐": "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
            "Combination Sum": "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.\n\nThe same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.",
            "House Robber": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
            "House Robber II": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
            "Decode Ways": "A message containing letters from A-Z can be encoded into numbers using the following mapping:\n\n'A' -> \"1\"\n'B' -> \"2\"\n...\n'Z' -> \"26\"\n\nTo decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways). For example, \"11106\" can be mapped into:\n\n\"AAJF\" with the grouping (1 1 10 6)\n\"KJF\" with the grouping (11 10 6)\n\nNote that the grouping (1 11 06) is invalid because \"06\" cannot be mapped into 'F' since \"6\" is different from \"06\".\n\nGiven a string s containing only digits, return the number of ways to decode it.",
            "Unique Paths": "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
            "Jump Game": "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise."
        },
        "Graph": {
            "Clone Graph": "Given a reference of a node in a connected undirected graph.\n\nReturn a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
            "Course Schedule": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\n\nReturn true if you can finish all courses. Otherwise, return false.",
            "Pacific Atlantic Water Flow": "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nThe island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).\n\nThe island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.\n\nReturn a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.",
            "Number of Islands": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
            "Longest Consecutive Sequence": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.",
            "Alien Dictionary ⭐": "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you.\n\nYou are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language.\n\nReturn a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return \"\". If there are multiple solutions, return any of them.",
            "Graph Valid Tree": "You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph.\n\nReturn true if the edges of the given graph make up a valid tree, and false otherwise.",
            "Number of Connected Components in an Undirected Graph": "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.\n\nReturn the number of connected components in the graph."
        },
        "Interval": {
            "Insert Interval": "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.\n\nInsert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).\n\nReturn intervals after the insertion.",
            "Merge Intervals": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
            "Non-overlapping Intervals": "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
            "Meeting Rooms": "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings.",
            "Meeting Rooms II": "Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required."
        },
        "Linked List": {
            "Reverse a Linked List": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
            "Detect Cycle in a Linked List": "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.",
            "Merge Two Sorted Lists": "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
            "Merge K Sorted Lists": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
            "Remove Nth Node From End Of List": "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
            "Reorder List": "You are given the head of a singly linked-list. The list can be represented as:\n\nL0 → L1 → … → Ln - 1 → Ln\n\nReorder the list to be on the following form:\n\nL0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …\n\nYou may not modify the values in the list's nodes. Only nodes themselves may be changed."
        },
        "Matrix": {
            "Set Matrix Zeroes": "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.\n\nYou must do it in place.",
            "Spiral Matrix": "Given an m x n matrix, return all elements of the matrix in spiral order.",
            "Rotate Image": "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
            "Word Search": "Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once."
        },
        "String": {
            "Longest Substring Without Repeating Characters": "Given a string s, find the length of the longest substring without repeating characters.",
            "Longest Repeating Character Replacement": "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.",
            "Minimum Window Substring": "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".\n\nThe testcases will be generated such that the answer is unique.",
            "Valid Anagram": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
            "Group Anagrams": "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
            "Valid Parentheses": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
            "Valid Palindrome": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.",
            "Longest Palindromic Substring": "Given a string s, return the longest palindromic substring in s.",
            "Palindromic Substrings": "Given a string s, return the number of palindromic substrings in it.\n\nA string is a palindrome when it reads the same backward as forward.\n\nA substring is a contiguous sequence of characters within the string.",
            "Encode and Decode Strings": "Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings."
        },
        "Tree": {
            "Maximum Depth of Binary Tree": "Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
            "Same Tree": "Given the roots of two binary trees p and q, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
            "Invert/Flip Binary Tree": "Given the root of a binary tree, invert the tree, and return its root.",
            "Binary Tree Maximum Path Sum": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node's values in the path.\n\nGiven the root of a binary tree, return the maximum path sum of any non-empty path.",
            "Binary Tree Level Order Traversal": "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
            "Serialize and Deserialize Binary Tree": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
            "Subtree of Another Tree": "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.\n\nA subtree of a binary tree tree is a tree that consists of a node in tree and all of this node's descendants. The tree tree could also be considered as a subtree of itself.",
            "Construct Binary Tree from Preorder and Inorder Traversal": "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
            "Validate Binary Search Tree": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n\nThe left subtree of a node contains only nodes with keys less than the node's key.\nThe right subtree of a node contains only nodes with keys greater than the node's key.\nBoth the left and right subtrees must also be binary search trees.",
            "Kth Smallest Element in a BST": "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
            "Lowest Common Ancestor of BST": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: 'The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).'",
            "Implement Trie (Prefix Tree)": "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the Trie class:\n\nTrie() Initializes the trie object.\nvoid insert(String word) Inserts the string word into the trie.\nboolean search(String word) Returns true if the string word is in the trie (i.e., was inserted before), and false otherwise.\nboolean startsWith(String prefix) Returns true if there is a previously inserted string word that has the prefix prefix, and false otherwise.",
            "Add and Search Word": "Design a data structure that supports adding new words and finding if a string matches any previously added string.\n\nImplement the WordDictionary class:\n\nWordDictionary() Initializes the object.\nvoid addWord(word) Adds word to the data structure, it can be matched later.\nbool search(word) Returns true if there is any string in the data structure that matches word or false otherwise. word may contain dots '.' where dots can be matched with any letter.",
            "Word Search II": "Given an m x n board of characters and a list of strings words, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word."
        },
        "Heap": {
            "Merge K Sorted Lists": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
            "Top K Frequent Elements": "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
            "Find Median from Data Stream": "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nFor example, for arr = [2,3,4], the median is 3.\nFor example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.\n\nImplement the MedianFinder class:\n\nMedianFinder() initializes the MedianFinder object.\nvoid addNum(int num) adds the integer num from the data stream to the data structure.\ndouble findMedian() returns the median of all elements so far. Answers within 10-5 of the actual answer will be accepted."
        }
    },
    "Salesforce Sheet": {
        "Array": {
            "Height Checker": "Difficulty: EASY\nFrequency: 73.0\nAcceptance Rate: 0.8113928378391797\nLink: https://leetcode.com/problems/height-checker\nTopics: Array, Sorting, Counting Sort",
            "Check If a Number Is Majority Element in a Sorted Array": "Difficulty: EASY\nFrequency: 70.8\nAcceptance Rate: 0.5908462374784931\nLink: https://leetcode.com/problems/check-if-a-number-is-majority-element-in-a-sorted-array\nTopics: Array, Binary Search",
            "Best Time to Buy and Sell Stock": "Difficulty: EASY\nFrequency: 68.3\nAcceptance Rate: 0.552596541931788\nLink: https://leetcode.com/problems/best-time-to-buy-and-sell-stock\nTopics: Array, Dynamic Programming",
            "Degree of an Array": "Difficulty: EASY\nFrequency: 49.0\nAcceptance Rate: 0.5742057825337067\nLink: https://leetcode.com/problems/degree-of-an-array\nTopics: Array, Hash Table",
            "Move Zeroes": "Difficulty: EASY\nFrequency: 42.3\nAcceptance Rate: 0.6280402658363383\nLink: https://leetcode.com/problems/move-zeroes\nTopics: Array, Two Pointers",
            "Maximum Difference Between Increasing Elements": "Difficulty: EASY\nFrequency: 42.3\nAcceptance Rate: 0.6610062659893959\nLink: https://leetcode.com/problems/maximum-difference-between-increasing-elements\nTopics: Array",
            "Majority Element": "Difficulty: EASY\nFrequency: 33.0\nAcceptance Rate: 0.6574028018936169\nLink: https://leetcode.com/problems/majority-element\nTopics: Array, Hash Table, Divide and Conquer, Sorting, Counting",
            "Subarray Product Less Than K": "Difficulty: MEDIUM\nFrequency: 87.3\nAcceptance Rate: 0.5285340562664164\nLink: https://leetcode.com/problems/subarray-product-less-than-k\nTopics: Array, Binary Search, Sliding Window, Prefix Sum",
            "Merge Intervals": "Difficulty: MEDIUM\nFrequency: 80.4\nAcceptance Rate: 0.49395267933200643\nLink: https://leetcode.com/problems/merge-intervals\nTopics: Array, Sorting",
            "Group Anagrams": "Difficulty: MEDIUM\nFrequency: 75.1\nAcceptance Rate: 0.7092882781909262\nLink: https://leetcode.com/problems/group-anagrams\nTopics: Array, Hash Table, String, Sorting",
            "Number of Islands": "Difficulty: MEDIUM\nFrequency: 75.1\nAcceptance Rate: 0.6231992538801062\nLink: https://leetcode.com/problems/number-of-islands\nTopics: Array, Depth-First Search, Breadth-First Search, Union Find, Matrix",
            "Count the Number of Fair Pairs": "Difficulty: MEDIUM\nFrequency: 73.0\nAcceptance Rate: 0.5291637303813359\nLink: https://leetcode.com/problems/count-the-number-of-fair-pairs\nTopics: Array, Two Pointers, Binary Search, Sorting",
            "Beautiful Towers I": "Difficulty: MEDIUM\nFrequency: 70.8\nAcceptance Rate: 0.433646463471382\nLink: https://leetcode.com/problems/beautiful-towers-i\nTopics: Array, Stack, Monotonic Stack",
            "Beautiful Towers II": "Difficulty: MEDIUM\nFrequency: 70.8\nAcceptance Rate: 0.3459771366358193\nLink: https://leetcode.com/problems/beautiful-towers-ii\nTopics: Array, Stack, Monotonic Stack",
            "Split Array Largest Sum": "Difficulty: MEDIUM\nFrequency: 68.3\nAcceptance Rate: 0.580995560819648\nLink: https://leetcode.com/problems/split-array-largest-sum\nTopics: Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum",
            "Trapping Rain Water ⭐": "Difficulty: MEDIUM\nFrequency: 68.3\nAcceptance Rate: 0.6510193782985645\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Kth Largest Element in an Array": "Difficulty: MEDIUM\nFrequency: 65.5\nAcceptance Rate: 0.6797700833982673\nLink: https://leetcode.com/problems/kth-largest-element-in-an-array\nTopics: Array, Divide and Conquer, Sorting, Heap (Priority Queue), Quickselect",
            "Beautiful Arrangement": "Difficulty: MEDIUM\nFrequency: 65.5\nAcceptance Rate: 0.6452784543104094\nLink: https://leetcode.com/problems/beautiful-arrangement\nTopics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask",
            "Asteroid Collision": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.45500659848234903\nLink: https://leetcode.com/problems/asteroid-collision\nTopics: Array, Stack, Simulation",
            "Largest Number": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.412803811932624\nLink: https://leetcode.com/problems/largest-number\nTopics: Array, String, Greedy, Sorting",
            "3Sum": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.370709504473534\nLink: https://leetcode.com/problems/3sum\nTopics: Array, Two Pointers, Sorting",
            "Coin Change": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.46495443407851283\nLink: https://leetcode.com/problems/coin-change\nTopics: Array, Dynamic Programming, Breadth-First Search",
            "Meeting Rooms II": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.5214164659444622\nLink: https://leetcode.com/problems/meeting-rooms-ii\nTopics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue), Prefix Sum",
            "Task Scheduler": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.6153909539748507\nLink: https://leetcode.com/problems/task-scheduler\nTopics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue), Counting",
            "Maximize Greatness of an Array": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.5864617466875623\nLink: https://leetcode.com/problems/maximize-greatness-of-an-array\nTopics: Array, Two Pointers, Greedy, Sorting",
            "Product of Array Except Self": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.6777995199303269\nLink: https://leetcode.com/problems/product-of-array-except-self\nTopics: Array, Prefix Sum",
            "Search in Rotated Sorted Array": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.4283722138743466\nLink: https://leetcode.com/problems/search-in-rotated-sorted-array\nTopics: Array, Binary Search",
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Jump Game": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.39479197867291327\nLink: https://leetcode.com/problems/jump-game\nTopics: Array, Dynamic Programming, Greedy",
            "Daily Temperatures": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.6736502939048284\nLink: https://leetcode.com/problems/daily-temperatures\nTopics: Array, Stack, Monotonic Stack",
            "Max Area of Island": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.7316416136206765\nLink: https://leetcode.com/problems/max-area-of-island\nTopics: Array, Depth-First Search, Breadth-First Search, Union Find, Matrix",
            "Capacity To Ship Packages Within D Days": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.7211759556022923\nLink: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days\nTopics: Array, Binary Search",
            "Container With Most Water": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.5778283165036205\nLink: https://leetcode.com/problems/container-with-most-water\nTopics: Array, Two Pointers, Greedy",
            "Rotting Oranges": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.5661849297144634\nLink: https://leetcode.com/problems/rotting-oranges\nTopics: Array, Breadth-First Search, Matrix",
            "Range Addition": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.7234787757990669\nLink: https://leetcode.com/problems/range-addition\nTopics: Array, Prefix Sum",
            "Sort Colors": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.675831142046278\nLink: https://leetcode.com/problems/sort-colors\nTopics: Array, Two Pointers, Sorting",
            "Minimum Path Sum": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.6648152266005115\nLink: https://leetcode.com/problems/minimum-path-sum\nTopics: Array, Dynamic Programming, Matrix",
            "Best Time to Buy and Sell Stock II": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.6950025067480458\nLink: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii\nTopics: Array, Dynamic Programming, Greedy",
            "Pairs of Songs With Total Durations Divisible by 60": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5324772640938334\nLink: https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60\nTopics: Array, Hash Table, Counting",
            "Triangle": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5929423967075687\nLink: https://leetcode.com/problems/triangle\nTopics: Array, Dynamic Programming",
            "2 Keys Keyboard": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5908827395526525\nLink: https://leetcode.com/problems/2-keys-keyboard\nTopics: Math, Dynamic Programming",
            "Predict the Winner": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5574273878146738\nLink: https://leetcode.com/problems/predict-the-winner\nTopics: Array, Math, Dynamic Programming, Recursion, Game Theory",
            "Count Primes": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.347906460282023\nLink: https://leetcode.com/problems/count-primes\nTopics: Array, Math, Enumeration, Number Theory",
            "IPO": "Difficulty: HARD\nFrequency: 49.0\nAcceptance Rate: 0.5302026973246128\nLink: https://leetcode.com/problems/ipo\nTopics: Array, Greedy, Sorting, Heap (Priority Queue)",
            "Partition Array Into Two Arrays to Minimize Sum Difference": "Difficulty: HARD\nFrequency: 49.0\nAcceptance Rate: 0.21752369802097132\nLink: https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference\nTopics: Array, Two Pointers, Binary Search, Dynamic Programming, Bit Manipulation, Ordered Set, Bitmask",
            "First Missing Positive": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.4108465766394882\nLink: https://leetcode.com/problems/first-missing-positive\nTopics: Array, Hash Table",
            "The Skyline Problem": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.4396233271583687\nLink: https://leetcode.com/problems/the-skyline-problem\nTopics: Array, Divide and Conquer, Binary Indexed Tree, Segment Tree, Line Sweep, Heap (Priority Queue), Ordered Set",
            "Top K Frequent Elements": "Difficulty: MEDIUM\nFrequency: 54.3\nAcceptance Rate: 0.6456598417590443\nLink: https://leetcode.com/problems/top-k-frequent-elements\nTopics: Array, Hash Table, Divide and Conquer, Sorting, Heap (Priority Queue), Bucket Sort, Counting, Quickselect",
            "House Robber": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.5230497484771839\nLink: https://leetcode.com/problems/house-robber\nTopics: Array, Dynamic Programming",
            "Kth Smallest Element in a Sorted Matrix": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.6356660329525441\nLink: https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix\nTopics: Array, Binary Search, Sorting, Heap (Priority Queue), Matrix",
            "Number of Matching Subsequences": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5068902297144416\nLink: https://leetcode.com/problems/number-of-matching-subsequences\nTopics: Array, Hash Table, String, Binary Search, Dynamic Programming, Trie, Sorting",
            "Majority Element II": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5438033603743202\nLink: https://leetcode.com/problems/majority-element-ii\nTopics: Array, Hash Table, Sorting, Counting",
            "Walls and Gates": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.6296791509568449\nLink: https://leetcode.com/problems/walls-and-gates\nTopics: Array, Breadth-First Search, Matrix"
        },
        "String": {
            "Check Whether Two Strings are Almost Equivalent": "Difficulty: EASY\nFrequency: 70.8\nAcceptance Rate: 0.6364656307145949\nLink: https://leetcode.com/problems/check-whether-two-strings-are-almost-equivalent\nTopics: Hash Table, String, Counting",
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 68.3\nAcceptance Rate: 0.42322822762811346\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack",
            "Is Subsequence": "Difficulty: EASY\nFrequency: 49.0\nAcceptance Rate: 0.4838264296140033\nLink: https://leetcode.com/problems/is-subsequence\nTopics: Two Pointers, String, Dynamic Programming",
            "Count Binary Substrings": "Difficulty: EASY\nFrequency: 49.0\nAcceptance Rate: 0.659166376012681\nLink: https://leetcode.com/problems/count-binary-substrings\nTopics: Two Pointers, String",
            "Roman to Integer": "Difficulty: EASY\nFrequency: 42.3\nAcceptance Rate: 0.6486627884371093\nLink: https://leetcode.com/problems/roman-to-integer\nTopics: Hash Table, Math, String",
            "Isomorphic Strings": "Difficulty: EASY\nFrequency: 33.0\nAcceptance Rate: 0.4685795790862557\nLink: https://leetcode.com/problems/isomorphic-strings\nTopics: Hash Table, String",
            "Reverse Words in a String III": "Difficulty: EASY\nFrequency: 33.0\nAcceptance Rate: 0.8365988595052404\nLink: https://leetcode.com/problems/reverse-words-in-a-string-iii\nTopics: Two Pointers, String",
            "String Compression": "Difficulty: MEDIUM\nFrequency: 84.8\nAcceptance Rate: 0.580915717497265\nLink: https://leetcode.com/problems/string-compression\nTopics: Two Pointers, String",
            "Longest Substring Without Repeating Characters": "Difficulty: MEDIUM\nFrequency: 73.0\nAcceptance Rate: 0.36936173184826904\nLink: https://leetcode.com/problems/longest-substring-without-repeating-characters\nTopics: Hash Table, String, Sliding Window",
            "Palindromic Substrings": "Difficulty: MEDIUM\nFrequency: 73.0\nAcceptance Rate: 0.7167859571435372\nLink: https://leetcode.com/problems/palindromic-substrings\nTopics: Two Pointers, String, Dynamic Programming",
            "Integer to Roman": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.6861928580376627\nLink: https://leetcode.com/problems/integer-to-roman\nTopics: Hash Table, Math, String",
            "Largest Number": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.412803811932624\nLink: https://leetcode.com/problems/largest-number\nTopics: Array, String, Greedy, Sorting",
            "Reconstruct Original Digits from English": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.5157334259339642\nLink: https://leetcode.com/problems/reconstruct-original-digits-from-english\nTopics: Hash Table, Math, String",
            "Decode String": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.6115249906697672\nLink: https://leetcode.com/problems/decode-string\nTopics: String, Stack, Recursion",
            "Different Ways to Add Parentheses": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.7235302545489278\nLink: https://leetcode.com/problems/different-ways-to-add-parentheses\nTopics: Math, String, Dynamic Programming, Recursion, Memoization",
            "Distinct Subsequences": "Difficulty: HARD\nFrequency: 80.4\nAcceptance Rate: 0.500998941013352\nLink: https://leetcode.com/problems/distinct-subsequences\nTopics: String, Dynamic Programming",
            "Design a Text Editor": "Difficulty: HARD\nFrequency: 73.0\nAcceptance Rate: 0.47138071447136626\nLink: https://leetcode.com/problems/design-a-text-editor\nTopics: Linked List, String, Stack, Design, Simulation, Doubly-Linked List",
            "Serialize and Deserialize Binary Tree": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.5896946953630543\nLink: https://leetcode.com/problems/serialize-and-deserialize-binary-tree\nTopics: String, Tree, Depth-First Search, Breadth-First Search, Design, Binary Tree",
            "Wildcard Matching": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.2989833857244126\nLink: https://leetcode.com/problems/wildcard-matching\nTopics: String, Dynamic Programming, Greedy, Recursion",
            "Stream of Characters": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.5122860949942819\nLink: https://leetcode.com/problems/stream-of-characters\nTopics: Array, String, Design, Trie, Data Stream",
            "Longest Valid Parentheses": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.3631311456770452\nLink: https://leetcode.com/problems/longest-valid-parentheses\nTopics: String, Dynamic Programming, Stack"
        },
        "Dynamic Programming": {
            "Word Break ⭐": "Difficulty: MEDIUM\nFrequency: 93.6\nAcceptance Rate: 0.48273764959175913\nLink: https://leetcode.com/problems/word-break\nTopics: Array, Hash Table, String, Dynamic Programming, Trie, Memoization",
            "Split Array Largest Sum": "Difficulty: MEDIUM\nFrequency: 68.3\nAcceptance Rate: 0.580995560819648\nLink: https://leetcode.com/problems/split-array-largest-sum\nTopics: Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum",
            "Trapping Rain Water ⭐": "Difficulty: MEDIUM\nFrequency: 68.3\nAcceptance Rate: 0.6510193782985645\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Beautiful Arrangement": "Difficulty: MEDIUM\nFrequency: 65.5\nAcceptance Rate: 0.6452784543104094\nLink: https://leetcode.com/problems/beautiful-arrangement\nTopics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask",
            "Coin Change": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.46495443407851283\nLink: https://leetcode.com/problems/coin-change\nTopics: Array, Dynamic Programming, Breadth-First Search",
            "Longest Palindromic Substring": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.35846104860827005\nLink: https://leetcode.com/problems/longest-palindromic-substring\nTopics: Two Pointers, String, Dynamic Programming",
            "Decode Ways": "Difficulty: MEDIUM\nFrequency: 54.3\nAcceptance Rate: 0.36530982861754346\nLink: https://leetcode.com/problems/decode-ways\nTopics: String, Dynamic Programming",
            "Maximal Square": "Difficulty: MEDIUM\nFrequency: 54.3\nAcceptance Rate: 0.4876133314788993\nLink: https://leetcode.com/problems/maximal-square\nTopics: Array, Dynamic Programming, Matrix",
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Jump Game": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.39479197867291327\nLink: https://leetcode.com/problems/jump-game\nTopics: Array, Dynamic Programming, Greedy",
            "Minimum Path Sum": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.6648152266005115\nLink: https://leetcode.com/problems/minimum-path-sum\nTopics: Array, Dynamic Programming, Matrix",
            "Triangle": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5929423967075687\nLink: https://leetcode.com/problems/triangle\nTopics: Array, Dynamic Programming",
            "2 Keys Keyboard": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5908827395526525\nLink: https://leetcode.com/problems/2-keys-keyboard\nTopics: Math, Dynamic Programming",
            "Predict the Winner": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5574273878146738\nLink: https://leetcode.com/problems/predict-the-winner\nTopics: Array, Math, Dynamic Programming, Recursion, Game Theory",
            "Distinct Subsequences": "Difficulty: HARD\nFrequency: 80.4\nAcceptance Rate: 0.500998941013352\nLink: https://leetcode.com/problems/distinct-subsequences\nTopics: String, Dynamic Programming",
            "Wildcard Matching": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.2989833857244126\nLink: https://leetcode.com/problems/wildcard-matching\nTopics: String, Dynamic Programming, Greedy, Recursion",
            "Longest Valid Parentheses": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.3631311456770452\nLink: https://leetcode.com/problems/longest-valid-parentheses\nTopics: String, Dynamic Programming, Stack"
        },
        "Tree": {
            "Validate Binary Search Tree": "Difficulty: MEDIUM\nFrequency: 54.3\nAcceptance Rate: 0.3438039571887417\nLink: https://leetcode.com/problems/validate-binary-search-tree\nTopics: Tree, Depth-First Search, Binary Search Tree, Binary Tree",
            "Populating Next Right Pointers in Each Node": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.6544149639689759\nLink: https://leetcode.com/problems/populating-next-right-pointers-in-each-node\nTopics: Linked List, Tree, Depth-First Search, Breadth-First Search, Binary Tree",
            "Construct Binary Tree from Preorder and Inorder Traversal": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.6683774773521286\nLink: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal\nTopics: Array, Hash Table, Divide and Conquer, Tree, Binary Tree",
            "Smallest Subtree with all the Deepest Nodes": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.7247234518141739\nLink: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes\nTopics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree",
            "Lowest Common Ancestor of a Binary Tree ⭐": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.6675499347216417\nLink: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree\nTopics: Tree, Depth-First Search, Binary Tree",
            "Flatten Binary Tree to Linked List": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.6851010744073592\nLink: https://leetcode.com/problems/flatten-binary-tree-to-linked-list\nTopics: Linked List, Stack, Tree, Depth-First Search, Binary Tree",
            "LFU Cache": "Difficulty: HARD\nFrequency: 80.4\nAcceptance Rate: 0.4660898637811462\nLink: https://leetcode.com/problems/lfu-cache\nTopics: Hash Table, Linked List, Design, Doubly-Linked List",
            "Serialize and Deserialize Binary Tree": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.5896946953630543\nLink: https://leetcode.com/problems/serialize-and-deserialize-binary-tree\nTopics: String, Tree, Depth-First Search, Breadth-First Search, Design, Binary Tree"
        },
        "Graph": {
            "Course Schedule II": "Difficulty: MEDIUM\nFrequency: 70.8\nAcceptance Rate: 0.5342350291611208\nLink: https://leetcode.com/problems/course-schedule-ii\nTopics: Depth-First Search, Breadth-First Search, Graph, Topological Sort",
            "Graph Valid Tree": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.4933560205084969\nLink: https://leetcode.com/problems/graph-valid-tree\nTopics: Depth-First Search, Breadth-First Search, Union Find, Graph"
        },
        "Design": {
            "LRU Cache": "Difficulty: MEDIUM\nFrequency: 78.8\nAcceptance Rate: 0.45214539356143535\nLink: https://leetcode.com/problems/lru-cache\nTopics: Hash Table, Linked List, Design, Doubly-Linked List",
            "Min Stack": "Difficulty: MEDIUM\nFrequency: 54.3\nAcceptance Rate: 0.564450954127768\nLink: https://leetcode.com/problems/min-stack\nTopics: Stack, Design",
            "Insert Delete GetRandom O(1)": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.549918579117808\nLink: https://leetcode.com/problems/insert-delete-getrandom-o1\nTopics: Array, Hash Table, Math, Design, Randomized",
            "LFU Cache": "Difficulty: HARD\nFrequency: 80.4\nAcceptance Rate: 0.4660898637811462\nLink: https://leetcode.com/problems/lfu-cache\nTopics: Hash Table, Linked List, Design, Doubly-Linked List",
            "Maximum Frequency Stack": "Difficulty: HARD\nFrequency: 73.0\nAcceptance Rate: 0.6620493032659615\nLink: https://leetcode.com/problems/maximum-frequency-stack\nTopics: Hash Table, Stack, Design, Ordered Set",
            "Design a Text Editor": "Difficulty: HARD\nFrequency: 73.0\nAcceptance Rate: 0.47138071447136626\nLink: https://leetcode.com/problems/design-a-text-editor\nTopics: Linked List, String, Stack, Design, Simulation, Doubly-Linked List",
            "Design In-Memory File System": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.4816948941663167\nLink: https://leetcode.com/problems/design-in-memory-file-system\nTopics: Hash Table, String, Design, Trie, Sorting"
        },
        "Math": {
            "Roman to Integer": "Difficulty: EASY\nFrequency: 42.3\nAcceptance Rate: 0.6486627884371093\nLink: https://leetcode.com/problems/roman-to-integer\nTopics: Hash Table, Math, String",
            "Integer to Roman": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.6861928580376627\nLink: https://leetcode.com/problems/integer-to-roman\nTopics: Hash Table, Math, String",
            "2 Keys Keyboard": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5908827395526525\nLink: https://leetcode.com/problems/2-keys-keyboard\nTopics: Math, Dynamic Programming",
            "Pow(x, n)": "Difficulty: MEDIUM\nFrequency: 42.3\nAcceptance Rate: 0.37023180307379455\nLink: https://leetcode.com/problems/powx-n\nTopics: Math, Recursion",
            "Predict the Winner": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.5574273878146738\nLink: https://leetcode.com/problems/predict-the-winner\nTopics: Array, Math, Dynamic Programming, Recursion, Game Theory",
            "Count Primes": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.347906460282023\nLink: https://leetcode.com/problems/count-primes\nTopics: Array, Math, Enumeration, Number Theory"
        },
        "Backtracking": {
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Subsets": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.808795565390318\nLink: https://leetcode.com/problems/subsets\nTopics: Array, Backtracking, Bit Manipulation",
            "Different Ways to Add Parentheses": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.7235302545489278\nLink: https://leetcode.com/problems/different-ways-to-add-parentheses\nTopics: Math, String, Dynamic Programming, Recursion, Memoization",
            "N-Queens": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.7281704967757537\nLink: https://leetcode.com/problems/n-queens\nTopics: Array, Backtracking"
        },
        "Stack": {
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 68.3\nAcceptance Rate: 0.42322822762811346\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack",
            "Asteroid Collision": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.45500659848234903\nLink: https://leetcode.com/problems/asteroid-collision\nTopics: Array, Stack, Simulation",
            "Min Stack": "Difficulty: MEDIUM\nFrequency: 54.3\nAcceptance Rate: 0.564450954127768\nLink: https://leetcode.com/problems/min-stack\nTopics: Stack, Design",
            "Daily Temperatures": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.6736502939048284\nLink: https://leetcode.com/problems/daily-temperatures\nTopics: Array, Stack, Monotonic Stack",
            "Maximum Frequency Stack": "Difficulty: HARD\nFrequency: 73.0\nAcceptance Rate: 0.6620493032659615\nLink: https://leetcode.com/problems/maximum-frequency-stack\nTopics: Hash Table, Stack, Design, Ordered Set"
        },
        "Heap": {
            "Kth Largest Element in an Array": "Difficulty: MEDIUM\nFrequency: 65.5\nAcceptance Rate: 0.6797700833982673\nLink: https://leetcode.com/problems/kth-largest-element-in-an-array\nTopics: Array, Divide and Conquer, Sorting, Heap (Priority Queue), Quickselect",
            "Meeting Rooms II": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.5214164659444622\nLink: https://leetcode.com/problems/meeting-rooms-ii\nTopics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue), Prefix Sum",
            "Task Scheduler": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.6153909539748507\nLink: https://leetcode.com/problems/task-scheduler\nTopics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue), Counting",
            "IPO": "Difficulty: HARD\nFrequency: 49.0\nAcceptance Rate: 0.5302026973246128\nLink: https://leetcode.com/problems/ipo\nTopics: Array, Greedy, Sorting, Heap (Priority Queue)",
            "The Skyline Problem": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.4396233271583687\nLink: https://leetcode.com/problems/the-skyline-problem\nTopics: Array, Divide and Conquer, Binary Indexed Tree, Segment Tree, Line Sweep, Heap (Priority Queue), Ordered Set",
            "Find Median from Data Stream": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.5327816407313548\nLink: https://leetcode.com/problems/find-median-from-data-stream\nTopics: Two Pointers, Design, Sorting, Heap (Priority Queue), Data Stream",
            "Merge k Sorted Lists": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.567741907864408\nLink: https://leetcode.com/problems/merge-k-sorted-lists\nTopics: Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort"
        },
        "Greedy": {
            "Largest Number": "Difficulty: MEDIUM\nFrequency: 62.3\nAcceptance Rate: 0.412803811932624\nLink: https://leetcode.com/problems/largest-number\nTopics: Array, String, Greedy, Sorting",
            "Task Scheduler": "Difficulty: MEDIUM\nFrequency: 58.6\nAcceptance Rate: 0.6153909539748507\nLink: https://leetcode.com/problems/task-scheduler\nTopics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue), Counting",
            "Best Time to Buy and Sell Stock II": "Difficulty: MEDIUM\nFrequency: 33.0\nAcceptance Rate: 0.6950025067480458\nLink: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii\nTopics: Array, Dynamic Programming, Greedy"
        },
        "Binary Search": {
            "Check If a Number Is Majority Element in a Sorted Array": "Difficulty: EASY\nFrequency: 70.8\nAcceptance Rate: 0.5908462374784931\nLink: https://leetcode.com/problems/check-if-a-number-is-majority-element-in-a-sorted-array\nTopics: Array, Binary Search",
            "Search in Rotated Sorted Array": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.4283722138743466\nLink: https://leetcode.com/problems/search-in-rotated-sorted-array\nTopics: Array, Binary Search",
            "Capacity To Ship Packages Within D Days": "Difficulty: MEDIUM\nFrequency: 49.0\nAcceptance Rate: 0.7211759556022923\nLink: https://leetcode.com/problems/capacity-to-ship-packages-within-d-days\nTopics: Array, Binary Search"
        },
        "Trie": {
            "Word Break ⭐": "Difficulty: MEDIUM\nFrequency: 93.6\nAcceptance Rate: 0.48273764959175913\nLink: https://leetcode.com/problems/word-break\nTopics: Array, Hash Table, String, Dynamic Programming, Trie, Memoization",
            "Stream of Characters": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.5122860949942819\nLink: https://leetcode.com/problems/stream-of-characters\nTopics: Array, String, Design, Trie, Data Stream"
        }
    },
    
    "Atlassian Sheet": {
        "Array": {
            "Maximum Area of Longest Diagonal Rectangle": "Difficulty: EASY\nFrequency: 58.7\nAcceptance Rate: 0.3654547482773711\nLink: https://leetcode.com/problems/maximum-area-of-longest-diagonal-rectangle\nTopics: Array",
            "Find the Width of Columns of a Grid": "Difficulty: EASY\nFrequency: 58.7\nAcceptance Rate: 0.693232244841104\nLink: https://leetcode.com/problems/find-the-width-of-columns-of-a-grid\nTopics: Array, Matrix",
            "Best Time to Buy and Sell Stock": "Difficulty: EASY\nFrequency: 49.5\nAcceptance Rate: 0.5525964317904726\nLink: https://leetcode.com/problems/best-time-to-buy-and-sell-stock\nTopics: Array, Dynamic Programming",
            "Can Place Flowers": "Difficulty: EASY\nFrequency: 46.2\nAcceptance Rate: 0.2889923936767658\nLink: https://leetcode.com/problems/can-place-flowers\nTopics: Array, Greedy",
            "Two Sum ⭐": "Difficulty: EASY\nFrequency: 42.2\nAcceptance Rate: 0.5577699935138669\nLink: https://leetcode.com/problems/two-sum\nTopics: Array, Hash Table",
            "Assign Cookies": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.5387634784437695\nLink: https://leetcode.com/problems/assign-cookies\nTopics: Array, Two Pointers, Greedy, Sorting",
            "Find Words That Can Be Formed by Characters": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.7106771491390691\nLink: https://leetcode.com/problems/find-words-that-can-be-formed-by-characters\nTopics: Array, Hash Table, String, Counting",
            "Merge Sorted Array": "Difficulty: EASY\nFrequency: 37.1\nAcceptance Rate: 0.5291952521829845\nLink: https://leetcode.com/problems/merge-sorted-array\nTopics: Array, Two Pointers, Sorting",
            "Crawler Log Folder": "Difficulty: EASY\nFrequency: 37.1\nAcceptance Rate: 0.7160418239109896\nLink: https://leetcode.com/problems/crawler-log-folder\nTopics: Array, String, Stack",
            "Rank Teams by Votes": "Difficulty: MEDIUM\nFrequency: 100.0\nAcceptance Rate: 0.5940446839336095\nLink: https://leetcode.com/problems/rank-teams-by-votes\nTopics: Array, Hash Table, String, Sorting, Counting",
            "Design Snake Game": "Difficulty: MEDIUM\nFrequency: 88.4\nAcceptance Rate: 0.3968485567576451\nLink: https://leetcode.com/problems/design-snake-game\nTopics: Array, Hash Table, Design, Queue, Simulation",
            "High-Access Employees": "Difficulty: MEDIUM\nFrequency: 71.2\nAcceptance Rate: 0.46126369648115073\nLink: https://leetcode.com/problems/high-access-employees\nTopics: Array, Hash Table, String, Sorting",
            "Merge Intervals": "Difficulty: MEDIUM\nFrequency: 61.9\nAcceptance Rate: 0.4939526848741133\nLink: https://leetcode.com/problems/merge-intervals\nTopics: Array, Sorting",
            "Maximum Good Subarray Sum": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.20281964321019574\nLink: https://leetcode.com/problems/maximum-good-subarray-sum\nTopics: Array, Hash Table, Prefix Sum",
            "Maximum Square Area by Removing Fences From a Field": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.2410700053616195\nLink: https://leetcode.com/problems/maximum-square-area-by-removing-fences-from-a-field\nTopics: Array, Hash Table, Enumeration",
            "Meeting Rooms II": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.5214164447683243\nLink: https://leetcode.com/problems/meeting-rooms-ii\nTopics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue), Prefix Sum",
            "Smallest Missing Non-negative Integer After Operations": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.3987738925814309\nLink: https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations\nTopics: Array, Hash Table, Math, Greedy",
            "Make Lexicographically Smallest Array by Swapping Elements": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.6026879026047842\nLink: https://leetcode.com/problems/make-lexicographically-smallest-array-by-swapping-elements\nTopics: Array, Union Find, Sorting",
            "Longest String Chain": "Difficulty: MEDIUM\nFrequency: 56.8\nAcceptance Rate: 0.6201512673699018\nLink: https://leetcode.com/problems/longest-string-chain\nTopics: Array, Hash Table, Two Pointers, String, Dynamic Programming, Sorting",
            "Longest Consecutive Sequence": "Difficulty: MEDIUM\nFrequency: 42.2\nAcceptance Rate: 0.47040822700681467\nLink: https://leetcode.com/problems/longest-consecutive-sequence\nTopics: Array, Hash Table, Union Find",
            "Integer to Roman": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.6861927118001762\nLink: https://leetcode.com/problems/integer-to-roman\nTopics: Hash Table, Math, String",
            "Pairs of Songs With Total Durations Divisible by 60": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.5324763404751333\nLink: https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60\nTopics: Array, Hash Table, Counting",
            "Jump Game II": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.415032966531176\nLink: https://leetcode.com/problems/jump-game-ii\nTopics: Array, Dynamic Programming, Greedy",
            "Boats to Save People": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.6030059688557481\nLink: https://leetcode.com/problems/boats-to-save-people\nTopics: Array, Two Pointers, Greedy, Sorting",
            "Maximum Number of Occurrences of a Substring": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.5342731408965465\nLink: https://leetcode.com/problems/maximum-number-of-occurrences-of-a-substring\nTopics: Hash Table, String, Sliding Window",
            "Maximum Subarray": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.5209978589630087\nLink: https://leetcode.com/problems/maximum-subarray\nTopics: Array, Divide and Conquer, Dynamic Programming",
            "Find First and Last Position of Element in Sorted Array": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.468287686874522\nLink: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array\nTopics: Array, Binary Search",
            "Count Vowel Strings in Ranges": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.6786629908928055\nLink: https://leetcode.com/problems/count-vowel-strings-in-ranges\nTopics: Array, String, Prefix Sum",
            "Container With Most Water": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.5778284346286925\nLink: https://leetcode.com/problems/container-with-most-water\nTopics: Array, Two Pointers, Greedy",
            "3Sum": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.37070969372685736\nLink: https://leetcode.com/problems/3sum\nTopics: Array, Two Pointers, Sorting",
            "Unique Paths II": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.43154324141961387\nLink: https://leetcode.com/problems/unique-paths-ii\nTopics: Array, Dynamic Programming, Matrix",
            "Find K Closest Elements": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.486686656754684\nLink: https://leetcode.com/problems/find-k-closest-elements\nTopics: Array, Two Pointers, Binary Search, Sliding Window, Sorting, Heap (Priority Queue)",
            "Single Element in a Sorted Array": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.5920694527750138\nLink: https://leetcode.com/problems/single-element-in-a-sorted-array\nTopics: Array, Binary Search",
            "Verbal Arithmetic Puzzle": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3477800583342335\nLink: https://leetcode.com/problems/verbal-arithmetic-puzzle\nTopics: Array, Math, String, Backtracking",
            "Cherry Pickup": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3786948581341589\nLink: https://leetcode.com/problems/cherry-pickup\nTopics: Array, Dynamic Programming, Matrix",
            "Russian Doll Envelopes": "Difficulty: HARD\nFrequency: 42.2\nAcceptance Rate: 0.3732991914997274\nLink: https://leetcode.com/problems/russian-doll-envelopes\nTopics: Array, Binary Search, Dynamic Programming, Sorting",
            "Trapping Rain Water ⭐": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.6510195479297859\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Tallest Billboard": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.5187288448273096\nLink: https://leetcode.com/problems/tallest-billboard\nTopics: Array, Dynamic Programming",
            "Last Day Where You Can Still Cross": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.6231939687413881\nLink: https://leetcode.com/problems/last-day-where-you-can-still-cross\nTopics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find, Matrix",
            "Online Election": "Difficulty: MEDIUM\nFrequency: 46.2\nAcceptance Rate: 0.5184691560254644\nLink: https://leetcode.com/problems/online-election\nTopics: Array, Hash Table, Binary Search, Design",
            "Minimum Time to Visit a Cell In a Grid": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.568054168958796\nLink: https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid\nTopics: Array, Breadth-First Search, Graph, Heap (Priority Queue), Matrix, Shortest Path",
            "Coin Change": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.4649545396006711\nLink: https://leetcode.com/problems/coin-change\nTopics: Array, Dynamic Programming, Breadth-First Search",
            "Majority Element II": "Difficulty: MEDIUM\nFrequency: 52.2\nAcceptance Rate: 0.5438036123865881\nLink: https://leetcode.com/problems/majority-element-ii\nTopics: Array, Hash Table, Sorting, Counting"
        },
        "String": {
            "Find Words That Can Be Formed by Characters": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.7106771491390691\nLink: https://leetcode.com/problems/find-words-that-can-be-formed-by-characters\nTopics: Array, Hash Table, String, Counting",
            "Valid Anagram": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.6666091503030548\nLink: https://leetcode.com/problems/valid-anagram\nTopics: Hash Table, String, Sorting",
            "Crawler Log Folder": "Difficulty: EASY\nFrequency: 37.1\nAcceptance Rate: 0.7160418239109896\nLink: https://leetcode.com/problems/crawler-log-folder\nTopics: Array, String, Stack",
            "Rank Teams by Votes": "Difficulty: MEDIUM\nFrequency: 100.0\nAcceptance Rate: 0.5940446839336095\nLink: https://leetcode.com/problems/rank-teams-by-votes\nTopics: Array, Hash Table, String, Sorting, Counting",
            "High-Access Employees": "Difficulty: MEDIUM\nFrequency: 71.2\nAcceptance Rate: 0.46126369648115073\nLink: https://leetcode.com/problems/high-access-employees\nTopics: Array, Hash Table, String, Sorting",
            "Group Anagrams": "Difficulty: MEDIUM\nFrequency: 56.8\nAcceptance Rate: 0.7092883082997726\nLink: https://leetcode.com/problems/group-anagrams\nTopics: Array, Hash Table, String, Sorting",
            "Longest Substring Without Repeating Characters": "Difficulty: MEDIUM\nFrequency: 42.2\nAcceptance Rate: 0.36936175423195367\nLink: https://leetcode.com/problems/longest-substring-without-repeating-characters\nTopics: Hash Table, String, Sliding Window",
            "Integer to Roman": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.6861927118001762\nLink: https://leetcode.com/problems/integer-to-roman\nTopics: Hash Table, Math, String",
            "Count Vowel Strings in Ranges": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.6786629908928055\nLink: https://leetcode.com/problems/count-vowel-strings-in-ranges\nTopics: Array, String, Prefix Sum",
            "Maximum Number of Occurrences of a Substring": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.5342731408965465\nLink: https://leetcode.com/problems/maximum-number-of-occurrences-of-a-substring\nTopics: Hash Table, String, Sliding Window",
            "Minimum Cost to Convert String I": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.5755714079298737\nLink: https://leetcode.com/problems/minimum-cost-to-convert-string-i\nTopics: Array, String, Graph, Shortest Path",
            "Design Add and Search Words Data Structure": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.47066560985497075\nLink: https://leetcode.com/problems/design-add-and-search-words-data-structure\nTopics: String, Depth-First Search, Design, Trie",
            "Search Suggestions System": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.6505032264917545\nLink: https://leetcode.com/problems/search-suggestions-system\nTopics: Array, String, Binary Search, Trie, Sorting, Heap (Priority Queue)",
            "Verbal Arithmetic Puzzle": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3477800583342335\nLink: https://leetcode.com/problems/verbal-arithmetic-puzzle\nTopics: Array, Math, String, Backtracking",
            "Text Justification": "Difficulty: HARD\nFrequency: 56.8\nAcceptance Rate: 0.48149935664104093\nLink: https://leetcode.com/problems/text-justification\nTopics: Array, String, Simulation",
            "String Transformation": "Difficulty: HARD\nFrequency: 46.2\nAcceptance Rate: 0.2510979075174374\nLink: https://leetcode.com/problems/string-transformation\nTopics: Math, String, Dynamic Programming, String Matching",
            "Minimum Cost to Convert String II": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.25539014373716634\nLink: https://leetcode.com/problems/minimum-cost-to-convert-string-ii\nTopics: Array, String, Dynamic Programming, Graph, Trie, Shortest Path"
        },
        "Dynamic Programming": {
            "Best Time to Buy and Sell Stock": "Difficulty: EASY\nFrequency: 49.5\nAcceptance Rate: 0.5525964317904726\nLink: https://leetcode.com/problems/best-time-to-buy-and-sell-stock\nTopics: Array, Dynamic Programming",
            "Longest String Chain": "Difficulty: MEDIUM\nFrequency: 56.8\nAcceptance Rate: 0.6201512673699018\nLink: https://leetcode.com/problems/longest-string-chain\nTopics: Array, Hash Table, Two Pointers, String, Dynamic Programming, Sorting",
            "Longest Increasing Subsequence ⭐": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.5780836795005291\nLink: https://leetcode.com/problems/longest-increasing-subsequence\nTopics: Array, Binary Search, Dynamic Programming",
            "Maximum Subarray": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.5209978589630087\nLink: https://leetcode.com/problems/maximum-subarray\nTopics: Array, Divide and Conquer, Dynamic Programming",
            "Jump Game II": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.415032966531176\nLink: https://leetcode.com/problems/jump-game-ii\nTopics: Array, Dynamic Programming, Greedy",
            "Unique Paths II": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.43154324141961387\nLink: https://leetcode.com/problems/unique-paths-ii\nTopics: Array, Dynamic Programming, Matrix",
            "Cherry Pickup": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3786948581341589\nLink: https://leetcode.com/problems/cherry-pickup\nTopics: Array, Dynamic Programming, Matrix",
            "Tallest Billboard": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.5187288448273096\nLink: https://leetcode.com/problems/tallest-billboard\nTopics: Array, Dynamic Programming",
            "Count Vowels Permutation": "Difficulty: HARD\nFrequency: 37.1\nAcceptance Rate: 0.61484920403603\nLink: https://leetcode.com/problems/count-vowels-permutation\nTopics: Dynamic Programming"
        },
        "Tree": {
            "Kth Largest Element in a Stream": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.5985304879240446\nLink: https://leetcode.com/problems/kth-largest-element-in-a-stream\nTopics: Tree, Design, Binary Search Tree, Heap (Priority Queue), Binary Tree, Data Stream",
            "Lowest Common Ancestor of a Binary Tree ⭐": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.6675501387816432\nLink: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree\nTopics: Tree, Depth-First Search, Binary Tree",
            "Lowest Common Ancestor of a Binary Tree III": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.8246674945153157\nLink: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii\nTopics: Hash Table, Two Pointers, Tree, Binary Tree"
        },
        "Graph": {
            "Minimum Cost to Convert String I": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.5755714079298737\nLink: https://leetcode.com/problems/minimum-cost-to-convert-string-i\nTopics: Array, String, Graph, Shortest Path",
            "The Time When the Network Becomes Idle": "Difficulty: MEDIUM\nFrequency: 46.2\nAcceptance Rate: 0.5372318622762673\nLink: https://leetcode.com/problems/the-time-when-the-network-becomes-idle\nTopics: Array, Breadth-First Search, Graph",
            "Maximum Path Quality of a Graph": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.596989256918232\nLink: https://leetcode.com/problems/maximum-path-quality-of-a-graph\nTopics: Array, Backtracking, Graph",
            "Last Day Where You Can Still Cross": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.6231939687413881\nLink: https://leetcode.com/problems/last-day-where-you-can-still-cross\nTopics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find, Matrix"
        },
        "Design": {
            "Logger Rate Limiter": "Difficulty: EASY\nFrequency: 71.2\nAcceptance Rate: 0.766103057053701\nLink: https://leetcode.com/problems/logger-rate-limiter\nTopics: Hash Table, Design, Data Stream",
            "Kth Largest Element in a Stream": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.5985304879240446\nLink: https://leetcode.com/problems/kth-largest-element-in-a-stream\nTopics: Tree, Design, Binary Search Tree, Heap (Priority Queue), Binary Tree, Data Stream",
            "Design Snake Game": "Difficulty: MEDIUM\nFrequency: 88.4\nAcceptance Rate: 0.3968485567576451\nLink: https://leetcode.com/problems/design-snake-game\nTopics: Array, Hash Table, Design, Queue, Simulation",
            "Stock Price Fluctuation": "Difficulty: MEDIUM\nFrequency: 86.6\nAcceptance Rate: 0.4816387154783381\nLink: https://leetcode.com/problems/stock-price-fluctuation\nTopics: Hash Table, Design, Heap (Priority Queue), Data Stream, Ordered Set",
            "Design File System": "Difficulty: MEDIUM\nFrequency: 56.8\nAcceptance Rate: 0.6413755041392486\nLink: https://leetcode.com/problems/design-file-system\nTopics: Hash Table, String, Design, Trie",
            "Design Tic-Tac-Toe": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.5860148086637603\nLink: https://leetcode.com/problems/design-tic-tac-toe\nTopics: Array, Hash Table, Design, Matrix, Simulation",
            "Search Suggestions System": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.6505032264917545\nLink: https://leetcode.com/problems/search-suggestions-system\nTopics: Array, String, Binary Search, Trie, Sorting, Heap (Priority Queue)",
            "Design a Food Rating System": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.44917837165941576\nLink: https://leetcode.com/problems/design-a-food-rating-system\nTopics: Array, Hash Table, String, Design, Heap (Priority Queue), Ordered Set",
            "Design Add and Search Words Data Structure": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.47066560985497075\nLink: https://leetcode.com/problems/design-add-and-search-words-data-structure\nTopics: String, Depth-First Search, Design, Trie",
            "Design Hit Counter": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.6920824458148753\nLink: https://leetcode.com/problems/design-hit-counter\nTopics: Array, Binary Search, Design, Queue, Data Stream",
            "All O`one Data Structure": "Difficulty: HARD\nFrequency: 77.2\nAcceptance Rate: 0.44134779761452186\nLink: https://leetcode.com/problems/all-oone-data-structure\nTopics: Hash Table, Linked List, Design, Doubly-Linked List"
        },
        "Math": {
            "Add Two Integers": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.8812230793897231\nLink: https://leetcode.com/problems/add-two-integers\nTopics: Math",
            "Smallest Missing Non-negative Integer After Operations": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.3987738925814309\nLink: https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations\nTopics: Array, Hash Table, Math, Greedy",
            "Integer to Roman": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.6861927118001762\nLink: https://leetcode.com/problems/integer-to-roman\nTopics: Hash Table, Math, String",
            "Number of Digit One": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.3599159436598703\nLink: https://leetcode.com/problems/number-of-digit-one\nTopics: Math, Dynamic Programming, Recursion",
            "String Transformation": "Difficulty: HARD\nFrequency: 46.2\nAcceptance Rate: 0.2510979075174374\nLink: https://leetcode.com/problems/string-transformation\nTopics: Math, String, Dynamic Programming, String Matching",
            "Nth Highest Salary": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.38039031689086605\nLink: https://leetcode.com/problems/nth-highest-salary\nTopics: Database"
        },
        "Backtracking": {
            "Word Search": "Difficulty: MEDIUM\nFrequency: 42.2\nAcceptance Rate: 0.4526695178423744\nLink: https://leetcode.com/problems/word-search\nTopics: Array, String, Backtracking, Depth-First Search, Matrix",
            "Verbal Arithmetic Puzzle": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3477800583342335\nLink: https://leetcode.com/problems/verbal-arithmetic-puzzle\nTopics: Array, Math, String, Backtracking",
            "Maximum Path Quality of a Graph": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.596989256918232\nLink: https://leetcode.com/problems/maximum-path-quality-of-a-graph\nTopics: Array, Backtracking, Graph"
        },
        "Stack": {
            "Crawler Log Folder": "Difficulty: EASY\nFrequency: 37.1\nAcceptance Rate: 0.7160418239109896\nLink: https://leetcode.com/problems/crawler-log-folder\nTopics: Array, String, Stack",
            "Trapping Rain Water ⭐": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.6510195479297859\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack"
        },
        "Heap": {
            "Meeting Rooms II": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.5214164447683243\nLink: https://leetcode.com/problems/meeting-rooms-ii\nTopics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue), Prefix Sum",
            "Stock Price Fluctuation": "Difficulty: MEDIUM\nFrequency: 86.6\nAcceptance Rate: 0.4816387154783381\nLink: https://leetcode.com/problems/stock-price-fluctuation\nTopics: Hash Table, Design, Heap (Priority Queue), Data Stream, Ordered Set",
            "Top K Frequent Elements": "Difficulty: MEDIUM\nFrequency: 46.2\nAcceptance Rate: 0.6456596310666731\nLink: https://leetcode.com/problems/top-k-frequent-elements\nTopics: Array, Hash Table, Divide and Conquer, Sorting, Heap (Priority Queue), Bucket Sort, Counting, Quickselect"
        },
        "Greedy": {
            "Can Place Flowers": "Difficulty: EASY\nFrequency: 46.2\nAcceptance Rate: 0.2889923936767658\nLink: https://leetcode.com/problems/can-place-flowers\nTopics: Array, Greedy",
            "Assign Cookies": "Difficulty: EASY\nFrequency: 30.0\nAcceptance Rate: 0.5387634784437695\nLink: https://leetcode.com/problems/assign-cookies\nTopics: Array, Two Pointers, Greedy, Sorting",
            "Meeting Rooms II": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.5214164447683243\nLink: https://leetcode.com/problems/meeting-rooms-ii\nTopics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue), Prefix Sum",
            "Jump Game II": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.415032966531176\nLink: https://leetcode.com/problems/jump-game-ii\nTopics: Array, Dynamic Programming, Greedy",
            "Boats to Save People": "Difficulty: MEDIUM\nFrequency: 37.1\nAcceptance Rate: 0.6030059688557481\nLink: https://leetcode.com/problems/boats-to-save-people\nTopics: Array, Two Pointers, Greedy, Sorting",
            "Container With Most Water": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.5778284346286925\nLink: https://leetcode.com/problems/container-with-most-water\nTopics: Array, Two Pointers, Greedy"
        },
        "Binary Search": {
            "Koko Eating Bananas": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.49067280156684456\nLink: https://leetcode.com/problems/koko-eating-bananas\nTopics: Array, Binary Search",
            "Find First and Last Position of Element in Sorted Array": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.468287686874522\nLink: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array\nTopics: Array, Binary Search",
            "Find K Closest Elements": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.486686656754684\nLink: https://leetcode.com/problems/find-k-closest-elements\nTopics: Array, Two Pointers, Binary Search, Sliding Window, Sorting, Heap (Priority Queue)",
            "Single Element in a Sorted Array": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.5920694527750138\nLink: https://leetcode.com/problems/single-element-in-a-sorted-array\nTopics: Array, Binary Search",
            "Russian Doll Envelopes": "Difficulty: HARD\nFrequency: 42.2\nAcceptance Rate: 0.3732991914997274\nLink: https://leetcode.com/problems/russian-doll-envelopes\nTopics: Array, Binary Search, Dynamic Programming, Sorting",
            "Last Day Where You Can Still Cross": "Difficulty: HARD\nFrequency: 30.0\nAcceptance Rate: 0.6231939687413881\nLink: https://leetcode.com/problems/last-day-where-you-can-still-cross\nTopics: Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find, Matrix"
        },
        "Trie": {
            "Design File System": "Difficulty: MEDIUM\nFrequency: 56.8\nAcceptance Rate: 0.6413755041392486\nLink: https://leetcode.com/problems/design-file-system\nTopics: Hash Table, String, Design, Trie",
            "Design Add and Search Words Data Structure": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.47066560985497075\nLink: https://leetcode.com/problems/design-add-and-search-words-data-structure\nTopics: String, Depth-First Search, Design, Trie",
            "Search Suggestions System": "Difficulty: MEDIUM\nFrequency: 30.0\nAcceptance Rate: 0.6505032264917545\nLink: https://leetcode.com/problems/search-suggestions-system\nTopics: Array, String, Binary Search, Trie, Sorting, Heap (Priority Queue)"
        },
        "Binary": {
            "Number of Possible Sets of Closing Branches": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.48448935008192245\nLink: https://leetcode.com/problems/number-of-possible-sets-of-closing-branches\nTopics: Bit Manipulation, Graph, Heap (Priority Queue), Enumeration, Shortest Path"
        }
    },
    "Microsoft Sheet": {
        "Array": {
            "Two Sum ⭐": "Difficulty: EASY\nFrequency: 100.0\nAcceptance Rate: 0.5577699843955036\nLink: https://leetcode.com/problems/two-sum\nTopics: Array, Hash Table",
            "Merge Sorted Array": "Difficulty: EASY\nFrequency: 83.7\nAcceptance Rate: 0.5291951450619177\nLink: https://leetcode.com/problems/merge-sorted-array\nTopics: Array, Two Pointers, Sorting",
            "Remove Duplicates from Sorted Array": "Difficulty: EASY\nFrequency: 64.5\nAcceptance Rate: 0.6035551112882038\nLink: https://leetcode.com/problems/remove-duplicates-from-sorted-array\nTopics: Array, Two Pointers",
            "Search Insert Position": "Difficulty: EASY\nFrequency: 52.2\nAcceptance Rate: 0.4901241638473952\nLink: https://leetcode.com/problems/search-insert-position\nTopics: Array, Binary Search",
            "Plus One": "Difficulty: EASY\nFrequency: 42.5\nAcceptance Rate: 0.47547621095134496\nLink: https://leetcode.com/problems/plus-one\nTopics: Array, Math",
            "Merge Intervals": "Difficulty: MEDIUM\nFrequency: 73.8\nAcceptance Rate: 0.4939527547797844\nLink: https://leetcode.com/problems/merge-intervals\nTopics: Array, Sorting",
            "Maximum Subarray": "Difficulty: MEDIUM\nFrequency: 72.9\nAcceptance Rate: 0.5209978267392302\nLink: https://leetcode.com/problems/maximum-subarray\nTopics: Array, Divide and Conquer, Dynamic Programming",
            "3Sum": "Difficulty: MEDIUM\nFrequency: 72.9\nAcceptance Rate: 0.37070946435035784\nLink: https://leetcode.com/problems/3sum\nTopics: Array, Two Pointers, Sorting",
            "Search in Rotated Sorted Array": "Difficulty: MEDIUM\nFrequency: 68.5\nAcceptance Rate: 0.4283722138743466\nLink: https://leetcode.com/problems/search-in-rotated-sorted-array\nTopics: Array, Binary Search",
            "Spiral Matrix": "Difficulty: MEDIUM\nFrequency: 68.3\nAcceptance Rate: 0.5393973501075863\nLink: https://leetcode.com/problems/spiral-matrix\nTopics: Array, Matrix, Simulation",
            "Rotate Image": "Difficulty: MEDIUM\nFrequency: 67.7\nAcceptance Rate: 0.7790164518819447\nLink: https://leetcode.com/problems/rotate-image\nTopics: Array, Math, Matrix",
            "Container With Most Water": "Difficulty: MEDIUM\nFrequency: 67.7\nAcceptance Rate: 0.5778282574410597\nLink: https://leetcode.com/problems/container-with-most-water\nTopics: Array, Two Pointers, Greedy",
            "Sort Colors": "Difficulty: MEDIUM\nFrequency: 65.8\nAcceptance Rate: 0.6758312948649591\nLink: https://leetcode.com/problems/sort-colors\nTopics: Array, Two Pointers, Sorting",
            "Set Matrix Zeroes": "Difficulty: MEDIUM\nFrequency: 62.9\nAcceptance Rate: 0.6070884347201074\nLink: https://leetcode.com/problems/set-matrix-zeroes\nTopics: Array, Hash Table, Matrix",
            "Jump Game": "Difficulty: MEDIUM\nFrequency: 59.4\nAcceptance Rate: 0.39479197867291327\nLink: https://leetcode.com/problems/jump-game\nTopics: Array, Dynamic Programming, Greedy",
            "Next Permutation": "Difficulty: MEDIUM\nFrequency: 59.0\nAcceptance Rate: 0.4305772664998175\nLink: https://leetcode.com/problems/next-permutation\nTopics: Array, Two Pointers",
            "Minimum Path Sum": "Difficulty: MEDIUM\nFrequency: 58.1\nAcceptance Rate: 0.664814934885504\nLink: https://leetcode.com/problems/minimum-path-sum\nTopics: Array, Dynamic Programming, Matrix",
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Find First and Last Position of Element in Sorted Array": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.4682873183580639\nLink: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array\nTopics: Array, Binary Search",
            "Jump Game II": "Difficulty: MEDIUM\nFrequency: 54.0\nAcceptance Rate: 0.4150331235291809\nLink: https://leetcode.com/problems/jump-game-ii\nTopics: Array, Dynamic Programming, Greedy",
            "4Sum": "Difficulty: MEDIUM\nFrequency: 52.2\nAcceptance Rate: 0.38219020113793045\nLink: https://leetcode.com/problems/4sum\nTopics: Array, Two Pointers, Sorting",
            "Subsets": "Difficulty: MEDIUM\nFrequency: 52.2\nAcceptance Rate: 0.808795565390318\nLink: https://leetcode.com/problems/subsets\nTopics: Array, Backtracking, Bit Manipulation",
            "Search a 2D Matrix": "Difficulty: MEDIUM\nFrequency: 50.9\nAcceptance Rate: 0.5228957258337302\nLink: https://leetcode.com/problems/search-a-2d-matrix\nTopics: Array, Binary Search, Matrix",
            "Valid Sudoku": "Difficulty: MEDIUM\nFrequency: 50.2\nAcceptance Rate: 0.6227675793740958\nLink: https://leetcode.com/problems/valid-sudoku\nTopics: Array, Hash Table, Matrix",
            "Divide Two Integers": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.18396975085033054\nLink: https://leetcode.com/problems/divide-two-integers\nTopics: Math, Bit Manipulation",
            "Remove Duplicates from Sorted Array II": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.6290185479131098\nLink: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii\nTopics: Array, Two Pointers",
            "Insert Interval": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.43473628714178475\nLink: https://leetcode.com/problems/insert-interval\nTopics: Array",
            "Combination Sum II": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.5767453180420465\nLink: https://leetcode.com/problems/combination-sum-ii\nTopics: Array, Backtracking",
            "Multiply Strings": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.4228941429852704\nLink: https://leetcode.com/problems/multiply-strings\nTopics: Math, String, Simulation",
            "Spiral Matrix II": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.734312719680276\nLink: https://leetcode.com/problems/spiral-matrix-ii\nTopics: Array, Matrix, Simulation",
            "3Sum Closest": "Difficulty: MEDIUM\nFrequency: 31.1\nAcceptance Rate: 0.468869600214817\nLink: https://leetcode.com/problems/3sum-closest\nTopics: Array, Two Pointers, Sorting",
            "First Missing Positive": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.4108465766394882\nLink: https://leetcode.com/problems/first-missing-positive\nTopics: Array, Hash Table",
            "Search in Rotated Sorted Array II": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.4552909516332913\nLink: https://leetcode.com/problems/search-in-rotated-sorted-array-ii\nTopics: Array, Binary Search",
            "Remove Element": "Difficulty: EASY\nFrequency: 60.0\nAcceptance Rate: 0.5152502866234081\nLink: https://leetcode.com/problems/remove-element\nTopics: Array, Two Pointers"
        },
        "String": {
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 72.9\nAcceptance Rate: 0.4232282567926559\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack",
            "Roman to Integer": "Difficulty: EASY\nFrequency: 68.3\nAcceptance Rate: 0.6486627884371093\nLink: https://leetcode.com/problems/roman-to-integer\nTopics: Hash Table, Math, String",
            "Longest Common Prefix": "Difficulty: EASY\nFrequency: 65.8\nAcceptance Rate: 0.4548305595040032\nLink: https://leetcode.com/problems/longest-common-prefix\nTopics: String, Trie",
            "Find the Index of the First Occurrence in a String": "Difficulty: EASY\nFrequency: 54.6\nAcceptance Rate: 0.449716000865219\nLink: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string\nTopics: Two Pointers, String, String Matching",
            "Length of Last Word": "Difficulty: EASY\nFrequency: 37.7\nAcceptance Rate: 0.5631926999044908\nLink: https://leetcode.com/problems/length-of-last-word\nTopics: String",
            "Add Binary": "Difficulty: EASY\nFrequency: 41.4\nAcceptance Rate: 0.5567701348180015\nLink: https://leetcode.com/problems/add-binary\nTopics: Math, String, Bit Manipulation, Simulation",
            "Longest Substring Without Repeating Characters": "Difficulty: MEDIUM\nFrequency: 79.4\nAcceptance Rate: 0.3693617011328274\nLink: https://leetcode.com/problems/longest-substring-without-repeating-characters\nTopics: Hash Table, String, Sliding Window",
            "Longest Palindromic Substring": "Difficulty: MEDIUM\nFrequency: 75.8\nAcceptance Rate: 0.35846111456358737\nLink: https://leetcode.com/problems/longest-palindromic-substring\nTopics: Two Pointers, String, Dynamic Programming",
            "Reverse Integer": "Difficulty: MEDIUM\nFrequency: 62.5\nAcceptance Rate: 0.3030891979001635\nLink: https://leetcode.com/problems/reverse-integer\nTopics: Math",
            "String to Integer (atoi)": "Difficulty: MEDIUM\nFrequency: 55.6\nAcceptance Rate: 0.19229423495277723\nLink: https://leetcode.com/problems/string-to-integer-atoi\nTopics: String",
            "Integer to Roman": "Difficulty: MEDIUM\nFrequency: 52.2\nAcceptance Rate: 0.6861928580376627\nLink: https://leetcode.com/problems/integer-to-roman\nTopics: Hash Table, Math, String",
            "Simplify Path": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.4785432317744196\nLink: https://leetcode.com/problems/simplify-path\nTopics: String, Stack",
            "Decode Ways": "Difficulty: MEDIUM\nFrequency: 45.5\nAcceptance Rate: 0.36530991972040927\nLink: https://leetcode.com/problems/decode-ways\nTopics: String, Dynamic Programming",
            "Zigzag Conversion": "Difficulty: MEDIUM\nFrequency: 43.6\nAcceptance Rate: 0.5160676713980508\nLink: https://leetcode.com/problems/zigzag-conversion\nTopics: String",
            "Interleaving String": "Difficulty: MEDIUM\nFrequency: 36.2\nAcceptance Rate: 0.4217918033968859\nLink: https://leetcode.com/problems/interleaving-string\nTopics: String, Dynamic Programming",
            "Count and Say": "Difficulty: MEDIUM\nFrequency: 31.1\nAcceptance Rate: 0.6050656775612677\nLink: https://leetcode.com/problems/count-and-say\nTopics: String",
            "Regular Expression Matching": "Difficulty: HARD\nFrequency: 51.6\nAcceptance Rate: 0.29280131010169236\nLink: https://leetcode.com/problems/regular-expression-matching\nTopics: String, Dynamic Programming, Recursion",
            "Longest Valid Parentheses": "Difficulty: HARD\nFrequency: 47.2\nAcceptance Rate: 0.3631311456770452\nLink: https://leetcode.com/problems/longest-valid-parentheses\nTopics: String, Dynamic Programming, Stack",
            "Minimum Window Substring": "Difficulty: HARD\nFrequency: 41.4\nAcceptance Rate: 0.45350747638232236\nLink: https://leetcode.com/problems/minimum-window-substring\nTopics: Hash Table, String, Sliding Window",
            "Wildcard Matching": "Difficulty: HARD\nFrequency: 39.0\nAcceptance Rate: 0.2989833857244126\nLink: https://leetcode.com/problems/wildcard-matching\nTopics: String, Dynamic Programming, Greedy, Recursion",
            "Substring with Concatenation of All Words": "Difficulty: HARD\nFrequency: 26.7\nAcceptance Rate: 0.32997499702748073\nLink: https://leetcode.com/problems/substring-with-concatenation-of-all-words\nTopics: Hash Table, String, Sliding Window",
            "Group Anagrams": "Difficulty: MEDIUM\nFrequency: 56.8\nAcceptance Rate: 0.7092883082997726\nLink: https://leetcode.com/problems/group-anagrams\nTopics: Array, Hash Table, String, Sorting"
        },
        "Dynamic Programming": {
            "Climbing Stairs": "Difficulty: EASY\nFrequency: 68.0\nAcceptance Rate: 0.5354071840932856\nLink: https://leetcode.com/problems/climbing-stairs\nTopics: Math, Dynamic Programming, Memoization",
            "Maximum Subarray": "Difficulty: MEDIUM\nFrequency: 72.9\nAcceptance Rate: 0.5209978267392302\nLink: https://leetcode.com/problems/maximum-subarray\nTopics: Array, Divide and Conquer, Dynamic Programming",
            "Jump Game": "Difficulty: MEDIUM\nFrequency: 59.4\nAcceptance Rate: 0.39479197867291327\nLink: https://leetcode.com/problems/jump-game\nTopics: Array, Dynamic Programming, Greedy",
            "Minimum Path Sum": "Difficulty: MEDIUM\nFrequency: 58.1\nAcceptance Rate: 0.664814934885504\nLink: https://leetcode.com/problems/minimum-path-sum\nTopics: Array, Dynamic Programming, Matrix",
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Jump Game II": "Difficulty: MEDIUM\nFrequency: 54.0\nAcceptance Rate: 0.4150331235291809\nLink: https://leetcode.com/problems/jump-game-ii\nTopics: Array, Dynamic Programming, Greedy",
            "Unique Paths": "Difficulty: MEDIUM\nFrequency: 52.8\nAcceptance Rate: 0.6577285437608488\nLink: https://leetcode.com/problems/unique-paths\nTopics: Math, Dynamic Programming, Combinatorics",
            "Decode Ways": "Difficulty: MEDIUM\nFrequency: 45.5\nAcceptance Rate: 0.36530991972040927\nLink: https://leetcode.com/problems/decode-ways\nTopics: String, Dynamic Programming",
            "Interleaving String": "Difficulty: MEDIUM\nFrequency: 36.2\nAcceptance Rate: 0.4217918033968859\nLink: https://leetcode.com/problems/interleaving-string\nTopics: String, Dynamic Programming",
            "Unique Paths II": "Difficulty: MEDIUM\nFrequency: 24.1\nAcceptance Rate: 0.43154364997722033\nLink: https://leetcode.com/problems/unique-paths-ii\nTopics: Array, Dynamic Programming, Matrix",
            "Unique Binary Search Trees": "Difficulty: MEDIUM\nFrequency: 21.0\nAcceptance Rate: 0.6244520536210353\nLink: https://leetcode.com/problems/unique-binary-search-trees\nTopics: Math, Dynamic Programming, Tree, Binary Search Tree, Binary Tree",
            "Unique Binary Search Trees II": "Difficulty: MEDIUM\nFrequency: 13.2\nAcceptance Rate: 0.6039807221122715\nLink: https://leetcode.com/problems/unique-binary-search-trees-ii\nTopics: Dynamic Programming, Backtracking, Tree, Binary Search Tree, Binary Tree",
            "Trapping Rain Water ⭐": "Difficulty: HARD\nFrequency: 75.7\nAcceptance Rate: 0.6510192988277056\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Largest Rectangle in Histogram": "Difficulty: HARD\nFrequency: 54.6\nAcceptance Rate: 0.4737765317407914\nLink: https://leetcode.com/problems/largest-rectangle-in-histogram\nTopics: Array, Stack, Monotonic Stack",
            "Maximal Rectangle": "Difficulty: HARD\nFrequency: 44.5\nAcceptance Rate: 0.5370845822665518\nLink: https://leetcode.com/problems/maximal-rectangle\nTopics: Array, Dynamic Programming, Stack, Matrix, Monotonic Stack",
            "Regular Expression Matching": "Difficulty: HARD\nFrequency: 51.6\nAcceptance Rate: 0.29280131010169236\nLink: https://leetcode.com/problems/regular-expression-matching\nTopics: String, Dynamic Programming, Recursion",
            "Longest Valid Parentheses": "Difficulty: HARD\nFrequency: 47.2\nAcceptance Rate: 0.3631311456770452\nLink: https://leetcode.com/problems/longest-valid-parentheses\nTopics: String, Dynamic Programming, Stack",
            "Minimum Window Substring": "Difficulty: HARD\nFrequency: 41.4\nAcceptance Rate: 0.45350747638232236\nLink: https://leetcode.com/problems/minimum-window-substring\nTopics: Hash Table, String, Sliding Window",
            "Wildcard Matching": "Difficulty: HARD\nFrequency: 39.0\nAcceptance Rate: 0.2989833857244126\nLink: https://leetcode.com/problems/wildcard-matching\nTopics: String, Dynamic Programming, Greedy, Recursion",
            "Edit Distance": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3717950891041048\nLink: https://leetcode.com/problems/edit-distance\nTopics: String, Dynamic Programming"
        },
        "Tree": {
            "Binary Tree Inorder Traversal": "Difficulty: EASY\nFrequency: 49.5\nAcceptance Rate: 0.7858399541084903\nLink: https://leetcode.com/problems/binary-tree-inorder-traversal\nTopics: Stack, Tree, Depth-First Search, Binary Tree",
            "Symmetric Tree": "Difficulty: EASY\nFrequency: 42.5\nAcceptance Rate: 0.5927867908424697\nLink: https://leetcode.com/problems/symmetric-tree\nTopics: Tree, Depth-First Search, Breadth-First Search, Binary Tree",
            "Same Tree": "Difficulty: EASY\nFrequency: 36.2\nAcceptance Rate: 0.651268811570624\nLink: https://leetcode.com/problems/same-tree\nTopics: Tree, Depth-First Search, Breadth-First Search, Binary Tree",
            "Maximum Depth of Binary Tree": "Difficulty: EASY\nFrequency: 36.2\nAcceptance Rate: 0.7713813520613833\nLink: https://leetcode.com/problems/maximum-depth-of-binary-tree\nTopics: Tree, Depth-First Search, Breadth-First Search, Binary Tree",
            "Binary Tree Zigzag Level Order Traversal": "Difficulty: MEDIUM\nFrequency: 57.6\nAcceptance Rate: 0.6168283891746636\nLink: https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal\nTopics: Tree, Breadth-First Search, Binary Tree",
            "Validate Binary Search Tree": "Difficulty: MEDIUM\nFrequency: 55.6\nAcceptance Rate: 0.34380387886661157\nLink: https://leetcode.com/problems/validate-binary-search-tree\nTopics: Tree, Depth-First Search, Binary Search Tree, Binary Tree",
            "Binary Tree Level Order Traversal": "Difficulty: MEDIUM\nFrequency: 50.9\nAcceptance Rate: 0.7059658947038693\nLink: https://leetcode.com/problems/binary-tree-level-order-traversal\nTopics: Tree, Breadth-First Search, Binary Tree",
            "Recover Binary Search Tree": "Difficulty: MEDIUM\nFrequency: 36.2\nAcceptance Rate: 0.5632431226781013\nLink: https://leetcode.com/problems/recover-binary-search-tree\nTopics: Tree, Depth-First Search, Binary Search Tree, Binary Tree",
            "Unique Binary Search Trees": "Difficulty: MEDIUM\nFrequency: 21.0\nAcceptance Rate: 0.6244520536210353\nLink: https://leetcode.com/problems/unique-binary-search-trees\nTopics: Math, Dynamic Programming, Tree, Binary Search Tree, Binary Tree",
            "Unique Binary Search Trees II": "Difficulty: MEDIUM\nFrequency: 13.2\nAcceptance Rate: 0.6039807221122715\nLink: https://leetcode.com/problems/unique-binary-search-trees-ii\nTopics: Dynamic Programming, Backtracking, Tree, Binary Search Tree, Binary Tree"
        },
        "Linked List": {
            "Merge Two Sorted Lists": "Difficulty: EASY\nFrequency: 68.5\nAcceptance Rate: 0.6684091757223755\nLink: https://leetcode.com/problems/merge-two-sorted-lists\nTopics: Linked List, Recursion",
            "Add Two Numbers": "Difficulty: MEDIUM\nFrequency: 78.3\nAcceptance Rate: 0.4622507658063209\nLink: https://leetcode.com/problems/add-two-numbers\nTopics: Linked List, Math, Recursion",
            "Swap Nodes in Pairs": "Difficulty: MEDIUM\nFrequency: 52.8\nAcceptance Rate: 0.6720136828647639\nLink: https://leetcode.com/problems/swap-nodes-in-pairs\nTopics: Linked List, Recursion",
            "Remove Nth Node From End of List": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.4896103765491196\nLink: https://leetcode.com/problems/remove-nth-node-from-end-of-list\nTopics: Linked List, Two Pointers",
            "Reverse Linked List II": "Difficulty: MEDIUM\nFrequency: 43.6\nAcceptance Rate: 0.49591736647057\nLink: https://leetcode.com/problems/reverse-linked-list-ii\nTopics: Linked List",
            "Rotate List": "Difficulty: MEDIUM\nFrequency: 36.2\nAcceptance Rate: 0.3994476047394924\nLink: https://leetcode.com/problems/rotate-list\nTopics: Linked List, Two Pointers",
            "Remove Duplicates from Sorted List II": "Difficulty: MEDIUM\nFrequency: 34.7\nAcceptance Rate: 0.4989080936318432\nLink: https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii\nTopics: Linked List, Two Pointers",
            "Partition List": "Difficulty: MEDIUM\nFrequency: 24.1\nAcceptance Rate: 0.5898677373641946\nLink: https://leetcode.com/problems/partition-list\nTopics: Linked List, Two Pointers",
            "Reverse Nodes in k-Group": "Difficulty: HARD\nFrequency: 68.5\nAcceptance Rate: 0.6304374335039493\nLink: https://leetcode.com/problems/reverse-nodes-in-k-group\nTopics: Linked List, Recursion",
            "Merge k Sorted Lists": "Difficulty: HARD\nFrequency: 67.5\nAcceptance Rate: 0.567741907864408\nLink: https://leetcode.com/problems/merge-k-sorted-lists\nTopics: Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort"
        },
        "Math": {
            "Roman to Integer": "Difficulty: EASY\nFrequency: 68.3\nAcceptance Rate: 0.6486627884371093\nLink: https://leetcode.com/problems/roman-to-integer\nTopics: Hash Table, Math, String",
            "Climbing Stairs": "Difficulty: EASY\nFrequency: 68.0\nAcceptance Rate: 0.5354071840932856\nLink: https://leetcode.com/problems/climbing-stairs\nTopics: Math, Dynamic Programming, Memoization",
            "Palindrome Number": "Difficulty: EASY\nFrequency: 67.5\nAcceptance Rate: 0.5922454522673172\nLink: https://leetcode.com/problems/palindrome-number\nTopics: Math",
            "Add Binary": "Difficulty: EASY\nFrequency: 41.4\nAcceptance Rate: 0.5567701348180015\nLink: https://leetcode.com/problems/add-binary\nTopics: Math, String, Bit Manipulation, Simulation",
            "Reverse Integer": "Difficulty: MEDIUM\nFrequency: 62.5\nAcceptance Rate: 0.3030891979001635\nLink: https://leetcode.com/problems/reverse-integer\nTopics: Math",
            "Pow(x, n)": "Difficulty: MEDIUM\nFrequency: 52.2\nAcceptance Rate: 0.3702318641045828\nLink: https://leetcode.com/problems/powx-n\nTopics: Math, Recursion",
            "Divide Two Integers": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.18396975085033054\nLink: https://leetcode.com/problems/divide-two-integers\nTopics: Math, Bit Manipulation",
            "Unique Paths": "Difficulty: MEDIUM\nFrequency: 52.8\nAcceptance Rate: 0.6577285437608488\nLink: https://leetcode.com/problems/unique-paths\nTopics: Math, Dynamic Programming, Combinatorics",
            "Unique Binary Search Trees": "Difficulty: MEDIUM\nFrequency: 21.0\nAcceptance Rate: 0.6244520536210353\nLink: https://leetcode.com/problems/unique-binary-search-trees\nTopics: Math, Dynamic Programming, Tree, Binary Search Tree, Binary Tree",
            "Sqrt(x)": "Difficulty: EASY\nFrequency: 52.2\nAcceptance Rate: 0.3672205022880447\nLink: https://leetcode.com/problems/sqrtx\nTopics: Math, Binary Search"
        },
        "Backtracking": {
            "Letter Combinations of a Phone Number": "Difficulty: MEDIUM\nFrequency: 62.5\nAcceptance Rate: 0.6385756647080152\nLink: https://leetcode.com/problems/letter-combinations-of-a-phone-number\nTopics: Hash Table, String, Backtracking",
            "Word Search": "Difficulty: MEDIUM\nFrequency: 60.6\nAcceptance Rate: 0.45266926269047814\nLink: https://leetcode.com/problems/word-search\nTopics: Array, String, Backtracking, Depth-First Search, Matrix",
            "Generate Parentheses": "Difficulty: MEDIUM\nFrequency: 60.2\nAcceptance Rate: 0.7713286717803378\nLink: https://leetcode.com/problems/generate-parentheses\nTopics: String, Dynamic Programming, Backtracking",
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Permutations": "Difficulty: MEDIUM\nFrequency: 54.0\nAcceptance Rate: 0.8066011364163758\nLink: https://leetcode.com/problems/permutations\nTopics: Array, Backtracking",
            "Subsets": "Difficulty: MEDIUM\nFrequency: 52.2\nAcceptance Rate: 0.808795565390318\nLink: https://leetcode.com/problems/subsets\nTopics: Array, Backtracking, Bit Manipulation",
            "Combination Sum II": "Difficulty: MEDIUM\nFrequency: 37.7\nAcceptance Rate: 0.5767453180420465\nLink: https://leetcode.com/problems/combination-sum-ii\nTopics: Array, Backtracking",
            "Subsets II": "Difficulty: MEDIUM\nFrequency: 36.2\nAcceptance Rate: 0.595072748658621\nLink: https://leetcode.com/problems/subsets-ii\nTopics: Array, Backtracking, Bit Manipulation",
            "Combinations": "Difficulty: MEDIUM\nFrequency: 31.1\nAcceptance Rate: 0.7289648238875795\nLink: https://leetcode.com/problems/combinations\nTopics: Backtracking",
            "3Sum Closest": "Difficulty: MEDIUM\nFrequency: 31.1\nAcceptance Rate: 0.468869600214817\nLink: https://leetcode.com/problems/3sum-closest\nTopics: Array, Two Pointers, Sorting",
            "N-Queens": "Difficulty: HARD\nFrequency: 50.9\nAcceptance Rate: 0.7281704967757537\nLink: https://leetcode.com/problems/n-queens\nTopics: Array, Backtracking",
            "N-Queens II": "Difficulty: HARD\nFrequency: 21.0\nAcceptance Rate: 0.7672955295381376\nLink: https://leetcode.com/problems/n-queens-ii\nTopics: Backtracking",
            "Permutations II": "Difficulty: MEDIUM\nFrequency: 47.5\nAcceptance Rate: 0.5549990977431888\nLink: https://leetcode.com/problems/permutations-ii\nTopics: Array, Backtracking"
        },
        "Stack": {
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 72.9\nAcceptance Rate: 0.4232282567926559\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack",
            "Binary Tree Inorder Traversal": "Difficulty: EASY\nFrequency: 49.5\nAcceptance Rate: 0.7858399541084903\nLink: https://leetcode.com/problems/binary-tree-inorder-traversal\nTopics: Stack, Tree, Depth-First Search, Binary Tree",
            "Simplify Path": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.4785432317744196\nLink: https://leetcode.com/problems/simplify-path\nTopics: String, Stack",
            "Largest Rectangle in Histogram": "Difficulty: HARD\nFrequency: 54.6\nAcceptance Rate: 0.4737765317407914\nLink: https://leetcode.com/problems/largest-rectangle-in-histogram\nTopics: Array, Stack, Monotonic Stack",
            "Longest Valid Parentheses": "Difficulty: HARD\nFrequency: 47.2\nAcceptance Rate: 0.3631311456770452\nLink: https://leetcode.com/problems/longest-valid-parentheses\nTopics: String, Dynamic Programming, Stack",
            "Trapping Rain Water ⭐": "Difficulty: HARD\nFrequency: 75.7\nAcceptance Rate: 0.6510192988277056\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Maximal Rectangle": "Difficulty: HARD\nFrequency: 44.5\nAcceptance Rate: 0.5370845822665518\nLink: https://leetcode.com/problems/maximal-rectangle\nTopics: Array, Dynamic Programming, Stack, Matrix, Monotonic Stack",
            "Wildcard Matching": "Difficulty: HARD\nFrequency: 39.0\nAcceptance Rate: 0.2989833857244126\nLink: https://leetcode.com/problems/wildcard-matching\nTopics: String, Dynamic Programming, Greedy, Recursion"
        },
        "Heap": {
            "Merge k Sorted Lists": "Difficulty: HARD\nFrequency: 67.5\nAcceptance Rate: 0.567741907864408\nLink: https://leetcode.com/problems/merge-k-sorted-lists\nTopics: Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort"
        },
        "Greedy": {
            "Jump Game": "Difficulty: MEDIUM\nFrequency: 59.4\nAcceptance Rate: 0.39479197867291327\nLink: https://leetcode.com/problems/jump-game\nTopics: Array, Dynamic Programming, Greedy",
            "Jump Game II": "Difficulty: MEDIUM\nFrequency: 54.0\nAcceptance Rate: 0.4150331235291809\nLink: https://leetcode.com/problems/jump-game-ii\nTopics: Array, Dynamic Programming, Greedy",
            "Container With Most Water": "Difficulty: MEDIUM\nFrequency: 67.7\nAcceptance Rate: 0.5778282574410597\nLink: https://leetcode.com/problems/container-with-most-water\nTopics: Array, Two Pointers, Greedy"
        },
        "Binary Search": {
            "Search Insert Position": "Difficulty: EASY\nFrequency: 52.2\nAcceptance Rate: 0.4901241638473952\nLink: https://leetcode.com/problems/search-insert-position\nTopics: Array, Binary Search",
            "Search in Rotated Sorted Array": "Difficulty: MEDIUM\nFrequency: 68.5\nAcceptance Rate: 0.4283722138743466\nLink: https://leetcode.com/problems/search-in-rotated-sorted-array\nTopics: Array, Binary Search",
            "Find First and Last Position of Element in Sorted Array": "Difficulty: MEDIUM\nFrequency: 54.6\nAcceptance Rate: 0.4682873183580639\nLink: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array\nTopics: Array, Binary Search",
            "Search a 2D Matrix": "Difficulty: MEDIUM\nFrequency: 50.9\nAcceptance Rate: 0.5228957258337302\nLink: https://leetcode.com/problems/search-a-2d-matrix\nTopics: Array, Binary Search, Matrix",
            "Median of Two Sorted Arrays": "Difficulty: HARD\nFrequency: 72.9\nAcceptance Rate: 0.43814591586025275\nLink: https://leetcode.com/problems/median-of-two-sorted-arrays\nTopics: Array, Binary Search, Divide and Conquer",
            "Sqrt(x)": "Difficulty: EASY\nFrequency: 52.2\nAcceptance Rate: 0.3672205022880447\nLink: https://leetcode.com/problems/sqrtx\nTopics: Math, Binary Search"
        },
        "Trie": {
            "Longest Common Prefix": "Difficulty: EASY\nFrequency: 65.8\nAcceptance Rate: 0.4548305595040032\nLink: https://leetcode.com/problems/longest-common-prefix\nTopics: String, Trie"
        },
        "Bit Manipulation": {
            "Add Binary": "Difficulty: EASY\nFrequency: 41.4\nAcceptance Rate: 0.5567701348180015\nLink: https://leetcode.com/problems/add-binary\nTopics: Math, String, Bit Manipulation, Simulation",
            "Divide Two Integers": "Difficulty: MEDIUM\nFrequency: 49.5\nAcceptance Rate: 0.18396975085033054\nLink: https://leetcode.com/problems/divide-two-integers\nTopics: Math, Bit Manipulation"
        },
        "Backtracking Extra": {
            "Sudoku Solver": "Difficulty: HARD\nFrequency: 62.5\nAcceptance Rate: 0.5860903198788493\nLink: https://leetcode.com/problems/sudoku-solver\nTopics: Array, Backtracking"
        }
    },
    "Airbnb Sheet": {
        "Array": {
            "Contains Duplicate II": "Difficulty: EASY\nFrequency: 72.4\nAcceptance Rate: 0.4904986450077176\nLink: https://leetcode.com/problems/contains-duplicate-ii\nTopics: Array, Hash Table, Sliding Window",
            "Two Sum ⭐": "Difficulty: EASY\nFrequency: 72.4\nAcceptance Rate: 0.5577699372797245\nLink: https://leetcode.com/problems/two-sum\nTopics: Array, Hash Table",
            "Contains Duplicate": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.6323635688111491\nLink: https://leetcode.com/problems/contains-duplicate\nTopics: Array, Hash Table, Sorting",
            "Can Place Flowers": "Difficulty: EASY\nFrequency: 36.3\nAcceptance Rate: 0.2889923936767658\nLink: https://leetcode.com/problems/can-place-flowers\nTopics: Array, Greedy",
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 87.2\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Smallest Common Region": "Difficulty: MEDIUM\nFrequency: 84.1\nAcceptance Rate: 0.679230513317286\nLink: https://leetcode.com/problems/smallest-common-region\nTopics: Array, Hash Table, String, Tree, Depth-First Search, Breadth-First Search",
            "Pour Water": "Difficulty: MEDIUM\nFrequency: 82.9\nAcceptance Rate: 0.47890661504572457\nLink: https://leetcode.com/problems/pour-water\nTopics: Array, Simulation",
            "Simple Bank System": "Difficulty: MEDIUM\nFrequency: 74.3\nAcceptance Rate: 0.6142935665806328\nLink: https://leetcode.com/problems/simple-bank-system\nTopics: Array, Hash Table, Design, Simulation",
            "House Robber": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5230497402554785\nLink: https://leetcode.com/problems/house-robber\nTopics: Array, Dynamic Programming",
            "Subarray Product Less Than K": "Difficulty: MEDIUM\nFrequency: 55.6\nAcceptance Rate: 0.5285345535980827\nLink: https://leetcode.com/problems/subarray-product-less-than-k\nTopics: Array, Binary Search, Sliding Window, Prefix Sum",
            "Merge Intervals": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.4939526057316443\nLink: https://leetcode.com/problems/merge-intervals\nTopics: Array, Sorting",
            "Shortest Path in Binary Matrix": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.49788745758374003\nLink: https://leetcode.com/problems/shortest-path-in-binary-matrix\nTopics: Array, Breadth-First Search, Matrix",
            "Fraction to Recurring Decimal": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.2622353839768554\nLink: https://leetcode.com/problems/fraction-to-recurring-decimal\nTopics: Hash Table, Math, String",
            "Coin Change": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.4649545396006711\nLink: https://leetcode.com/problems/coin-change\nTopics: Array, Dynamic Programming, Breadth-First Search",
            "Text Justification": "Difficulty: HARD\nFrequency: 100.0\nAcceptance Rate: 0.48149935664104093\nLink: https://leetcode.com/problems/text-justification\nTopics: Array, String, Simulation",
            "Maximum Profit in Job Scheduling": "Difficulty: HARD\nFrequency: 94.5\nAcceptance Rate: 0.5441735043380527\nLink: https://leetcode.com/problems/maximum-profit-in-job-scheduling\nTopics: Array, Binary Search, Dynamic Programming, Sorting",
            "Trapping Rain Water ⭐": "Difficulty: HARD\nFrequency: 80.4\nAcceptance Rate: 0.6510194684590559\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Sliding Puzzle": "Difficulty: HARD\nFrequency: 79.0\nAcceptance Rate: 0.7313248932064185\nLink: https://leetcode.com/problems/sliding-puzzle\nTopics: Array, Dynamic Programming, Backtracking, Breadth-First Search, Memoization, Matrix",
            "Shortest Path to Get All Keys": "Difficulty: HARD\nFrequency: 74.3\nAcceptance Rate: 0.537030042053839\nLink: https://leetcode.com/problems/shortest-path-to-get-all-keys\nTopics: Array, Bit Manipulation, Breadth-First Search, Matrix",
            "Employee Free Time": "Difficulty: HARD\nFrequency: 74.3\nAcceptance Rate: 0.7259759595862569\nLink: https://leetcode.com/problems/employee-free-time\nTopics: Array, Line Sweep, Sorting, Heap (Priority Queue)",
            "Maximum Candies You Can Get from Boxes": "Difficulty: HARD\nFrequency: 72.4\nAcceptance Rate: 0.6877100758915674\nLink: https://leetcode.com/problems/maximum-candies-you-can-get-from-boxes\nTopics: Array, Breadth-First Search, Graph",
            "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix": "Difficulty: HARD\nFrequency: 70.4\nAcceptance Rate: 0.7195955875149401\nLink: https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix\nTopics: Array, Hash Table, Bit Manipulation, Breadth-First Search, Matrix",
            "Contains Duplicate III": "Difficulty: MEDIUM\nFrequency: 58.7\nAcceptance Rate: 0.2193840565956839\nLink: https://leetcode.com/problems/contains-duplicate-iii\nTopics: Array, Sliding Window, Sorting, Ordered Set"
        },
        "String": {
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.42322829911519266\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack",
            "Add Strings": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.5190382397212994\nLink: https://leetcode.com/problems/add-strings\nTopics: Math, String, Simulation",
            "Smallest Common Region": "Difficulty: MEDIUM\nFrequency: 84.1\nAcceptance Rate: 0.679230513317286\nLink: https://leetcode.com/problems/smallest-common-region\nTopics: Array, Hash Table, String, Tree, Depth-First Search, Breadth-First Search",
            "Basic Calculator II": "Difficulty: MEDIUM\nFrequency: 72.4\nAcceptance Rate: 0.4581138691872612\nLink: https://leetcode.com/problems/basic-calculator-ii\nTopics: Math, String, Stack",
            "Mini Parser": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.40213967163699704\nLink: https://leetcode.com/problems/mini-parser\nTopics: String, Stack, Depth-First Search",
            "IP to CIDR": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5492354970683057\nLink: https://leetcode.com/problems/ip-to-cidr\nTopics: String, Bit Manipulation",
            "Strings Differ by One Character": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.41068439650362654\nLink: https://leetcode.com/problems/strings-differ-by-one-character\nTopics: Hash Table, String, Rolling Hash, Hash Function",
            "Robot Bounded In Circle": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5622965278408281\nLink: https://leetcode.com/problems/robot-bounded-in-circle\nTopics: Math, String, Simulation",
            "Minimize Rounding Error to Meet Target": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.45439788115682\nLink: https://leetcode.com/problems/minimize-rounding-error-to-meet-target\nTopics: Array, Math, String, Greedy, Sorting",
            "Fraction to Recurring Decimal": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.2622353839768554\nLink: https://leetcode.com/problems/fraction-to-recurring-decimal\nTopics: Hash Table, Math, String",
            "Text Justification": "Difficulty: HARD\nFrequency: 100.0\nAcceptance Rate: 0.48149935664104093\nLink: https://leetcode.com/problems/text-justification\nTopics: Array, String, Simulation",
            "Maximum Profit in Job Scheduling": "Difficulty: HARD\nFrequency: 94.5\nAcceptance Rate: 0.5441735043380527\nLink: https://leetcode.com/problems/maximum-profit-in-job-scheduling\nTopics: Array, Binary Search, Dynamic Programming, Sorting",
            "Minimum Window Substring": "Difficulty: HARD\nFrequency: 74.3\nAcceptance Rate: 0.45350701011329586\nLink: https://leetcode.com/problems/minimum-window-substring\nTopics: Hash Table, String, Sliding Window",
            "Word Search II": "Difficulty: HARD\nFrequency: 72.4\nAcceptance Rate: 0.3732633211647155\nLink: https://leetcode.com/problems/word-search-ii\nTopics: Array, String, Backtracking, Trie, Matrix",
            "Regular Expression Matching": "Difficulty: HARD\nFrequency: 70.4\nAcceptance Rate: 0.29280116328628375\nLink: https://leetcode.com/problems/regular-expression-matching\nTopics: String, Dynamic Programming, Recursion",
            "Shortest Uncommon Substring in an Array": "Difficulty: HARD\nFrequency: 33.0\nAcceptance Rate: 0.4010000000000000\nLink: https://leetcode.com/problems/shortest-uncommon-substring-in-an-array\nTopics: Array, String, Trie"
        },
        "Dynamic Programming": {
            "House Robber": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5230497402554785\nLink: https://leetcode.com/problems/house-robber\nTopics: Array, Dynamic Programming",
            "Maximal Square": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.4876133314788993\nLink: https://leetcode.com/problems/maximal-square\nTopics: Array, Dynamic Programming, Matrix",
            "Subarray Product Less Than K": "Difficulty: MEDIUM\nFrequency: 55.6\nAcceptance Rate: 0.5285345535980827\nLink: https://leetcode.com/problems/subarray-product-less-than-k\nTopics: Array, Binary Search, Sliding Window, Prefix Sum",
            "Coin Change": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.4649545396006711\nLink: https://leetcode.com/problems/coin-change\nTopics: Array, Dynamic Programming, Breadth-First Search",
            "Cheapest Flights Within K Stops": "Difficulty: MEDIUM\nFrequency: 80.4\nAcceptance Rate: 0.4039897286127686\nLink: https://leetcode.com/problems/cheapest-flights-within-k-stops\nTopics: Dynamic Programming, Depth-First Search, Breadth-First Search, Graph, Heap (Priority Queue), Shortest Path",
            "Maximum Profit in Job Scheduling": "Difficulty: HARD\nFrequency: 94.5\nAcceptance Rate: 0.5441735043380527\nLink: https://leetcode.com/problems/maximum-profit-in-job-scheduling\nTopics: Array, Binary Search, Dynamic Programming, Sorting",
            "Trapping Rain Water ⭐": "Difficulty: HARD\nFrequency: 80.4\nAcceptance Rate: 0.6510194684590559\nLink: https://leetcode.com/problems/trapping-rain-water\nTopics: Array, Two Pointers, Dynamic Programming, Stack, Monotonic Stack",
            "Sliding Puzzle": "Difficulty: HARD\nFrequency: 79.0\nAcceptance Rate: 0.7313248932064185\nLink: https://leetcode.com/problems/sliding-puzzle\nTopics: Array, Dynamic Programming, Backtracking, Breadth-First Search, Memoization, Matrix"
        },
        "Graph": {
            "Cheapest Flights Within K Stops": "Difficulty: MEDIUM\nFrequency: 80.4\nAcceptance Rate: 0.4039897286127686\nLink: https://leetcode.com/problems/cheapest-flights-within-k-stops\nTopics: Dynamic Programming, Depth-First Search, Breadth-First Search, Graph, Heap (Priority Queue), Shortest Path",
            "Minimum Number of Vertices to Reach All Nodes": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.8115726945174798\nLink: https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes\nTopics: Graph",
            "Smallest Common Region": "Difficulty: MEDIUM\nFrequency: 84.1\nAcceptance Rate: 0.679230513317286\nLink: https://leetcode.com/problems/smallest-common-region\nTopics: Array, Hash Table, String, Tree, Depth-First Search, Breadth-First Search",
            "Employee Free Time": "Difficulty: HARD\nFrequency: 74.3\nAcceptance Rate: 0.7259759595862569\nLink: https://leetcode.com/problems/employee-free-time\nTopics: Array, Line Sweep, Sorting, Heap (Priority Queue)",
            "Maximum Candies You Can Get from Boxes": "Difficulty: HARD\nFrequency: 72.4\nAcceptance Rate: 0.6877100758915674\nLink: https://leetcode.com/problems/maximum-candies-you-can-get-from-boxes\nTopics: Array, Breadth-First Search, Graph",
            "Alien Dictionary ⭐": "Difficulty: HARD\nFrequency: 42.3\nAcceptance Rate: 0.3490000000000000\nLink: https://leetcode.com/problems/alien-dictionary\nTopics: Graph, Topological Sort, BFS, DFS"
        },
        "Design": {
            "Simple Bank System": "Difficulty: MEDIUM\nFrequency: 74.3\nAcceptance Rate: 0.6142935665806328\nLink: https://leetcode.com/problems/simple-bank-system\nTopics: Array, Hash Table, Design, Simulation",
            "Design File System": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.6413755041392486\nLink: https://leetcode.com/problems/design-file-system\nTopics: Hash Table, String, Design, Trie",
            "Design Tic-Tac-Toe": "Difficulty: MEDIUM\nFrequency: 59.5\nAcceptance Rate: 0.5860139660881724\nLink: https://leetcode.com/problems/design-tic-tac-toe\nTopics: Array, Hash Table, Design, Matrix, Simulation",
            "Flatten 2D Vector": "Difficulty: MEDIUM\nFrequency: 89.9\nAcceptance Rate: 0.5013489435679918\nLink: https://leetcode.com/problems/flatten-2d-vector\nTopics: Array, Two Pointers, Design, Iterator",
            "Time Based Key-Value Store": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.4936626151018991\nLink: https://leetcode.com/problems/time-based-key-value-store\nTopics: Hash Table, String, Binary Search, Design",
            "Flatten Nested List Iterator": "Difficulty: MEDIUM\nFrequency: 36.3\nAcceptance Rate: 0.6522839525510098\nLink: https://leetcode.com/problems/flatten-nested-list-iterator\nTopics: Stack, Tree, Depth-First Search, Design, Queue, Iterator",
            "Design Excel Sum Formula": "Difficulty: HARD\nFrequency: 50.8\nAcceptance Rate: 0.42568163292465855\nLink: https://leetcode.com/problems/design-excel-sum-formula\nTopics: Array, Hash Table, String, Graph, Design, Topological Sort, Matrix",
            "All O`one Data Structure": "Difficulty: HARD\nFrequency: 44.8\nAcceptance Rate: 0.44134779761452186\nLink: https://leetcode.com/problems/all-oone-data-structure\nTopics: Hash Table, Linked List, Design, Doubly-Linked List"
        },
        "Math": {
            "Happy Number": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.5807264413215366\nLink: https://leetcode.com/problems/happy-number\nTopics: Hash Table, Math, Two Pointers",
            "Add Strings": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.5190382397212994\nLink: https://leetcode.com/problems/add-strings\nTopics: Math, String, Simulation",
            "Robot Bounded In Circle": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5622965278408281\nLink: https://leetcode.com/problems/robot-bounded-in-circle\nTopics: Math, String, Simulation",
            "Minimize Rounding Error to Meet Target": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.45439788115682\nLink: https://leetcode.com/problems/minimize-rounding-error-to-meet-target\nTopics: Array, Math, String, Greedy, Sorting",
            "Number of Ways to Build House of Cards": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.6217366080061884\nLink: https://leetcode.com/problems/number-of-ways-to-build-house-of-cards\nTopics: Math, Dynamic Programming",
            "Convert to Base -2": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.6126841577912198\nLink: https://leetcode.com/problems/convert-to-base-2\nTopics: Math"
        },
        "Backtracking": {
            "Combination Sum": "Difficulty: MEDIUM\nFrequency: 87.2\nAcceptance Rate: 0.7467468656021409\nLink: https://leetcode.com/problems/combination-sum\nTopics: Array, Backtracking",
            "Sliding Puzzle": "Difficulty: HARD\nFrequency: 79.0\nAcceptance Rate: 0.7313248932064185\nLink: https://leetcode.com/problems/sliding-puzzle\nTopics: Array, Dynamic Programming, Backtracking, Breadth-First Search, Memoization, Matrix",
            "Word Search II": "Difficulty: HARD\nFrequency: 72.4\nAcceptance Rate: 0.3732633211647155\nLink: https://leetcode.com/problems/word-search-ii\nTopics: Array, String, Backtracking, Trie, Matrix"
        },
        "Stack": {
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.42322829911519266\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack",
            "Basic Calculator II": "Difficulty: MEDIUM\nFrequency: 72.4\nAcceptance Rate: 0.4581138691872612\nLink: https://leetcode.com/problems/basic-calculator-ii\nTopics: Math, String, Stack",
            "Mini Parser": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.40213967163699704\nLink: https://leetcode.com/problems/mini-parser\nTopics: String, Stack, Depth-First Search",
            "Valid Parentheses": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.42322829911519266\nLink: https://leetcode.com/problems/valid-parentheses\nTopics: String, Stack"
        },
        "Heap": {
            "Employee Free Time": "Difficulty: HARD\nFrequency: 74.3\nAcceptance Rate: 0.7259759595862569\nLink: https://leetcode.com/problems/employee-free-time\nTopics: Array, Line Sweep, Sorting, Heap (Priority Queue)"
        },
        "Greedy": {
            "Can Place Flowers": "Difficulty: EASY\nFrequency: 36.3\nAcceptance Rate: 0.2889923936767658\nLink: https://leetcode.com/problems/can-place-flowers\nTopics: Array, Greedy",
            "Minimize Rounding Error to Meet Target": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.45439788115682\nLink: https://leetcode.com/problems/minimize-rounding-error-to-meet-target\nTopics: Array, Math, String, Greedy, Sorting"
        },
        "Binary Search": {
            "Maximum Profit in Job Scheduling": "Difficulty: HARD\nFrequency: 94.5\nAcceptance Rate: 0.5441735043380527\nLink: https://leetcode.com/problems/maximum-profit-in-job-scheduling\nTopics: Array, Binary Search, Dynamic Programming, Sorting"
        },
        "Trie": {
            "Smallest Common Region": "Difficulty: MEDIUM\nFrequency: 84.1\nAcceptance Rate: 0.679230513317286\nLink: https://leetcode.com/problems/smallest-common-region\nTopics: Array, Hash Table, String, Tree, Depth-First Search, Breadth-First Search",
            "Word Search II": "Difficulty: HARD\nFrequency: 72.4\nAcceptance Rate: 0.3732633211647155\nLink: https://leetcode.com/problems/word-search-ii\nTopics: Array, String, Backtracking, Trie, Matrix",
            "Palindrome Pairs": "Difficulty: HARD\nFrequency: 58.7\nAcceptance Rate: 0.3740000000000000\nLink: https://leetcode.com/problems/palindrome-pairs\nTopics: Array, Hash Table, String, Trie"
        },
        "Bit Manipulation": {
            "Single Number": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.759688387220078\nLink: https://leetcode.com/problems/single-number\nTopics: Array, Bit Manipulation",
            "Reverse Bits": "Difficulty: EASY\nFrequency: 70.4\nAcceptance Rate: 0.6320549868777902\nLink: https://leetcode.com/problems/reverse-bits\nTopics: Divide and Conquer, Bit Manipulation",
            "Pyramid Transition Matrix": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5291127410721871\nLink: https://leetcode.com/problems/pyramid-transition-matrix\nTopics: Bit Manipulation, Depth-First Search, Breadth-First Search",
            "IP to CIDR": "Difficulty: MEDIUM\nFrequency: 70.4\nAcceptance Rate: 0.5492354970683057\nLink: https://leetcode.com/problems/ip-to-cidr\nTopics: String, Bit Manipulation",
            "Shortest Path to Get All Keys": "Difficulty: HARD\nFrequency: 74.3\nAcceptance Rate: 0.537030042053839\nLink: https://leetcode.com/problems/shortest-path-to-get-all-keys\nTopics: Array, Bit Manipulation, Breadth-First Search, Matrix",
            "Minimum Number of Flips to Convert Binary Matrix to Zero Matrix": "Difficulty: HARD\nFrequency: 70.4\nAcceptance Rate: 0.7195955875149401\nLink: https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix\nTopics: Array, Hash Table, Bit Manipulation, Breadth-First Search, Matrix"
        },
        "Linked List": {
            "Add Two Numbers": "Difficulty: MEDIUM\nFrequency: 78.3\nAcceptance Rate: 0.4622507658063209\nLink: https://leetcode.com/problems/add-two-numbers\nTopics: Linked List, Math, Recursion",
            "Intersection of Two Linked Lists": "Difficulty: EASY\nFrequency: 58.7\nAcceptance Rate: 0.5143508240815807\nLink: https://leetcode.com/problems/intersection-of-two-linked-lists\nTopics: Hash Table, Linked List, Two Pointers"
        },
        "Tree": {
            "Convert Sorted Array to Binary Search Tree": "Difficulty: EASY\nFrequency: 58.7\nAcceptance Rate: 0.7205457458968746\nLink: https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree\nTopics: Array, Divide and Conquer, Tree, Binary Search Tree, Binary Tree"
        },
        "Heap Extra": {
            "Merge k Sorted Lists": "Difficulty: HARD\nFrequency: 67.5\nAcceptance Rate: 0.567741907864408\nLink: https://leetcode.com/problems/merge-k-sorted-lists\nTopics: Linked List, Divide and Conquer, Heap (Priority Queue), Merge Sort"
        }
    }
};
